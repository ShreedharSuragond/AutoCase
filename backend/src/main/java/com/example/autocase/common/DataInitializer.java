package com.example.autocase.common;

import com.example.autocase.audit.AuditEvent;
import com.example.autocase.audit.AuditEventRepository;
import com.example.autocase.automation.*;
import com.example.autocase.notification.Notification;
import com.example.autocase.notification.NotificationRepository;
import com.example.autocase.project.Project;
import com.example.autocase.project.ProjectRepository;
import com.example.autocase.user.Permission;
import com.example.autocase.user.PermissionRepository;
import com.example.autocase.user.Role;
import com.example.autocase.user.RoleRepository;
import com.example.autocase.user.User;
import com.example.autocase.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final ProjectRepository projectRepository;
    private final GenerationRequestRepository generationRequestRepository;
    private final TestScenarioRepository testScenarioRepository;
    private final GeneratedArtifactRepository generatedArtifactRepository;
    private final ValidationRunRepository validationRunRepository;
    private final GitDeliveryRepository gitDeliveryRepository;
    private final AuditEventRepository auditEventRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        initPermissionsAndRoles();
        initDefaultUsers();
        initDatabaseProjectsAndRequests();
    }

    private void initPermissionsAndRoles() {
        String[] permissionNames = {
                "DASHBOARD_VIEW",
                "PROJECT_CREATE_MANAGE",
                "SCENARIO_GENERATE",
                "CODE_GENERATE",
                "VALIDATE_EXECUTE",
                "CODE_REVIEW_APPROVE",
                "GIT_DELIVER",
                "USER_ROLE_MANAGE",
                "SYSTEM_SETTINGS_MANAGE",
                "ORGANIZATION_ANALYTICS_VIEW",
                "AUDIT_VIEW"
        };

        Map<String, Permission> permissionMap = new HashMap<>();
        for (String pName : permissionNames) {
            Permission permission = permissionRepository.findByName(pName)
                    .orElseGet(() -> permissionRepository.save(
                            Permission.builder()
                                    .name(pName)
                                    .description("Grants capability: " + pName)
                                    .build()
                    ));
            permissionMap.put(pName, permission);
        }

        createRoleIfNotExists("ROLE_SUPER_ADMIN", "Super Administrator with global access",
                new HashSet<>(permissionMap.values()));

        Set<Permission> adminPerms = new HashSet<>(permissionMap.values());
        createRoleIfNotExists("ROLE_ADMIN", "Administrator with project, user and analytics management", adminPerms);

        Set<Permission> pmPerms = Set.of(
                permissionMap.get("DASHBOARD_VIEW"),
                permissionMap.get("PROJECT_CREATE_MANAGE"),
                permissionMap.get("SCENARIO_GENERATE"),
                permissionMap.get("CODE_GENERATE"),
                permissionMap.get("VALIDATE_EXECUTE"),
                permissionMap.get("CODE_REVIEW_APPROVE"),
                permissionMap.get("GIT_DELIVER"),
                permissionMap.get("ORGANIZATION_ANALYTICS_VIEW")
        );
        createRoleIfNotExists("ROLE_PROJECT_MANAGER", "Project Manager with scenario & delivery management", pmPerms);

        Set<Permission> qaPerms = Set.of(
                permissionMap.get("DASHBOARD_VIEW"),
                permissionMap.get("PROJECT_CREATE_MANAGE"),
                permissionMap.get("SCENARIO_GENERATE"),
                permissionMap.get("CODE_GENERATE"),
                permissionMap.get("VALIDATE_EXECUTE"),
                permissionMap.get("CODE_REVIEW_APPROVE"),
                permissionMap.get("GIT_DELIVER")
        );
        createRoleIfNotExists("ROLE_DEVELOPER_QA", "Developer or QA Engineer generating and reviewing automations", qaPerms);

        Set<Permission> reviewerPerms = Set.of(
                permissionMap.get("DASHBOARD_VIEW"),
                permissionMap.get("VALIDATE_EXECUTE"),
                permissionMap.get("CODE_REVIEW_APPROVE")
        );
        createRoleIfNotExists("ROLE_REVIEWER", "Reviewer validating and approving scenarios and code", reviewerPerms);

        Set<Permission> viewerPerms = Set.of(
                permissionMap.get("DASHBOARD_VIEW")
        );
        createRoleIfNotExists("ROLE_VIEWER", "Viewer with read-only access", viewerPerms);
    }

    private void createRoleIfNotExists(String name, String description, Set<Permission> perms) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = Role.builder()
                    .name(name)
                    .description(description)
                    .permissions(perms)
                    .build();
            roleRepository.save(role);
            log.info("Initialized role: {}", name);
        }
    }

    private void initDefaultUsers() {
        Role superAdminRole = roleRepository.findByName("ROLE_SUPER_ADMIN").orElse(null);
        Role qaRole = roleRepository.findByName("ROLE_DEVELOPER_QA").orElse(null);

        if (userRepository.findByEmailIgnoreCase("admin@autocase.ai").isEmpty() && superAdminRole != null) {
            User admin = User.builder()
                    .email("admin@autocase.ai")
                    .fullName("Automation Administrator")
                    .password(passwordEncoder.encode("Admin@123"))
                    .team("Platform Engineering")
                    .status("ACTIVE")
                    .roles(Set.of(superAdminRole))
                    .build();
            userRepository.save(admin);
            log.info("Seeded default admin user in DB: admin@autocase.ai");
        }

        if (userRepository.findByEmailIgnoreCase("automation.user@autocase.ai").isEmpty() && qaRole != null) {
            User qaUser = User.builder()
                    .email("automation.user@autocase.ai")
                    .fullName("Automation User")
                    .password(passwordEncoder.encode("AutoCase@123"))
                    .team("QA Automation Core")
                    .status("ACTIVE")
                    .roles(Set.of(qaRole))
                    .build();
            userRepository.save(qaUser);
            log.info("Seeded default QA user in DB: automation.user@autocase.ai");
        }
    }

    private void initDatabaseProjectsAndRequests() {
        if (projectRepository.count() > 0) {
            return;
        }

        User qaUser = userRepository.findByEmailIgnoreCase("automation.user@autocase.ai").orElse(null);
        if (qaUser == null) return;

        Project provProject = projectRepository.save(Project.builder()
                .name("Provider Search Automation")
                .projectKey("PROV")
                .description("Core enterprise healthcare provider directory and credentialing tests")
                .defaultRepoUrl("https://gitlab.com/healthtech-core/provider-portal-automation.git")
                .defaultBranch("main")
                .framework("Java + Selenium + Cucumber + POM")
                .owner(qaUser)
                .build());

        Project payProject = projectRepository.save(Project.builder()
                .name("Payment API Tests")
                .projectKey("PAY")
                .description("Payment gateway and settlement reconciliation tests")
                .defaultRepoUrl("https://gitlab.com/healthtech-core/payment-gateway-automation.git")
                .defaultBranch("main")
                .framework("TypeScript + Playwright")
                .owner(qaUser)
                .build());

        Project authProject = projectRepository.save(Project.builder()
                .name("User Login Tests")
                .projectKey("AUTH")
                .description("OAuth2 OIDC single sign-on authentication suites")
                .defaultRepoUrl("https://gitlab.com/healthtech-core/auth-service-automation.git")
                .defaultBranch("main")
                .framework("Java + Selenium")
                .owner(qaUser)
                .build());

        GenerationRequest provReq = generationRequestRepository.save(GenerationRequest.builder()
                .project(provProject)
                .user(qaUser)
                .jiraTicketId("JIRA-1234")
                .title("Provider Search Automation")
                .instructionType("Jira Ticket + Screenshot")
                .status("DELIVERED")
                .targetRepo(provProject.getDefaultRepoUrl())
                .targetBranch("main")
                .targetFolder("src/test/java/com/healthtech/automation")
                .requirementSummary("Search health providers by National Provider Identifier (NPI). Results display NPI, provider name, specialty, clinic location, and active status.")
                .observations("UI screenshot contains 10-digit numeric input, 'Search' button, 'Clear' button, and a sortable data table.")
                .assumptions("NPI is assumed to follow the 10-digit Luhn check standard.")
                .build());

        GenerationRequest payReq = generationRequestRepository.save(GenerationRequest.builder()
                .project(payProject)
                .user(qaUser)
                .jiraTicketId("JIRA-1180")
                .title("Payment API Tests")
                .instructionType("API Documentation + OpenAPI")
                .status("IN_REVIEW")
                .targetRepo(payProject.getDefaultRepoUrl())
                .targetBranch("main")
                .targetFolder("tests/api")
                .requirementSummary("Verify idempotency and transaction validation for credit card processing API.")
                .build());

        GenerationRequest authReq = generationRequestRepository.save(GenerationRequest.builder()
                .project(authProject)
                .user(qaUser)
                .jiraTicketId("JIRA-1159")
                .title("User Login Tests")
                .instructionType("Manual Requirement")
                .status("CODE_GENERATED")
                .targetRepo(authProject.getDefaultRepoUrl())
                .targetBranch("main")
                .targetFolder("src/test/java/com/healthtech/auth")
                .requirementSummary("Validate SSO redirect, multi-factor authentication prompt, and session expiry.")
                .build());

        List<TestScenario> scenarios = List.of(
                TestScenario.builder()
                        .generationRequest(provReq)
                        .title("Valid NPI returns matching provider record")
                        .scenarioType("Positive")
                        .description("Enter registered 10-digit NPI and verify table contains provider name, specialty, and clinic.")
                        .bddGherkin("Scenario: Search by valid NPI\n  Given user is on search page\n  When enters NPI '1093847562'\n  Then displays Dr. Sarah Connor")
                        .status("APPROVED")
                        .orderIndex(1)
                        .build(),
                TestScenario.builder()
                        .generationRequest(provReq)
                        .title("Invalid NPI format displays validation alert")
                        .scenarioType("Validation")
                        .description("Enter non-numeric input and verify validation message.")
                        .bddGherkin("Scenario: Search by invalid NPI format\n  When user enters NPI '123ABC'\n  Then validation message 'NPI must be exactly 10 digits' is displayed")
                        .status("APPROVED")
                        .orderIndex(2)
                        .build(),
                TestScenario.builder()
                        .generationRequest(provReq)
                        .title("Clear button resets filters and results")
                        .scenarioType("Positive")
                        .description("Clicking Clear resets input and table.")
                        .bddGherkin("Scenario: Clear reset\n  When clicks Clear\n  Then input field and table are cleared")
                        .status("APPROVED")
                        .orderIndex(3)
                        .build()
        );
        testScenarioRepository.saveAll(scenarios);

        validationRunRepository.save(ValidationRun.builder()
                .generationRequest(provReq)
                .status("PASSED")
                .syntaxPassed(true)
                .structurePassed(true)
                .locatorChecksPassed(true)
                .stepBindingPassed(true)
                .compilerLogs("[INFO] Compiling source files\n[INFO] BUILD SUCCESS")
                .executionTimeMs(1480L)
                .completedAt(LocalDateTime.now().minusMinutes(12))
                .build());

        gitDeliveryRepository.save(GitDelivery.builder()
                .generationRequest(provReq)
                .branchName("ai-generated/JIRA-1234-provider-search-tests")
                .commitSha("7f3a9e1c2b5d4f6e8a0b1c3d5e7f9a2b4c6e8f01")
                .commitMessage("test: add provider search automation for JIRA-1234")
                .mergeRequestUrl("https://gitlab.com/healthtech-core/provider-portal-automation/-/merge_requests/42")
                .status("DELIVERED")
                .deliveredAt(LocalDateTime.now().minusMinutes(10))
                .build());

        auditEventRepository.saveAll(List.of(
                AuditEvent.builder()
                        .actorEmail(qaUser.getEmail())
                        .action("DELIVER_AUTOMATION_MR")
                        .entityType("GenerationRequest")
                        .entityId(provReq.getId().toString())
                        .details("Automation pushed to GitLab JIRA-1234")
                        .outcome("Completed")
                        .createdAt(LocalDateTime.now().minusMinutes(10))
                        .build(),
                AuditEvent.builder()
                        .actorEmail(qaUser.getEmail())
                        .action("CODE_GENERATION")
                        .entityType("GenerationRequest")
                        .entityId(provReq.getId().toString())
                        .details("Code generation completed JIRA-1234")
                        .outcome("Success")
                        .createdAt(LocalDateTime.now().minusMinutes(15))
                        .build(),
                AuditEvent.builder()
                        .actorEmail(qaUser.getEmail())
                        .action("SCENARIO_GENERATION")
                        .entityType("GenerationRequest")
                        .entityId(provReq.getId().toString())
                        .details("Test scenarios generated JIRA-1234")
                        .outcome("Review Needed")
                        .createdAt(LocalDateTime.now().minusMinutes(20))
                        .build(),
                AuditEvent.builder()
                        .actorEmail(qaUser.getEmail())
                        .action("REQUIREMENT_ANALYSIS")
                        .entityType("GenerationRequest")
                        .entityId(provReq.getId().toString())
                        .details("Requirement analysis started JIRA-1234")
                        .outcome("Analyzing")
                        .createdAt(LocalDateTime.now().minusMinutes(22))
                        .build()
        ));

        notificationRepository.save(Notification.builder()
                .userEmail(qaUser.getEmail())
                .title("Automation Pushed to GitLab")
                .message("Merge Request #42 created for JIRA-1234 Provider Search Automation")
                .type("SUCCESS")
                .link("https://gitlab.com/healthtech-core/provider-portal-automation/-/merge_requests/42")
                .isRead(false)
                .createdAt(LocalDateTime.now().minusMinutes(10))
                .build());

        log.info("Initialized real PostgreSQL relational dataset for AutoCase AI!");
    }
}
