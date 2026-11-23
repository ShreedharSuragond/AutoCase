package com.example.autocase.automation;

import com.example.autocase.audit.AuditEvent;
import com.example.autocase.audit.AuditEventRepository;
import com.example.autocase.dashboard.DashboardStatsDto;
import com.example.autocase.dashboard.RecentActivityDto;
import com.example.autocase.dashboard.RecentProjectDto;
import com.example.autocase.notification.Notification;
import com.example.autocase.notification.NotificationRepository;
import com.example.autocase.project.Project;
import com.example.autocase.project.ProjectRepository;
import com.example.autocase.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutomationService {

    private final ProjectRepository projectRepository;
    private final GenerationRequestRepository generationRequestRepository;
    private final TestScenarioRepository testScenarioRepository;
    private final GeneratedArtifactRepository generatedArtifactRepository;
    private final ValidationRunRepository validationRunRepository;
    private final GitDeliveryRepository gitDeliveryRepository;
    private final AuditEventRepository auditEventRepository;
    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long projectCount = projectRepository.count();
        long testsCount = testScenarioRepository.count();
        long successfulRuns = validationRunRepository.countByStatusIgnoreCase("PASSED");
        long pendingReviews = testScenarioRepository.countByStatusIgnoreCase("DRAFT");

        List<GenerationRequest> dbRequests = generationRequestRepository.findTop5ByOrderByCreatedAtDesc();
        List<RecentProjectDto> recentProjects = new ArrayList<>();

        for (GenerationRequest req : dbRequests) {
            String name = req.getTitle() != null ? req.getTitle() :
                    (req.getProject() != null ? req.getProject().getName() : "Automation Suite");
            String ticket = req.getJiraTicketId() != null && !req.getJiraTicketId().isBlank()
                    ? req.getJiraTicketId()
                    : (req.getProject() != null ? req.getProject().getProjectKey() : "AUTO");
            String framework = req.getProject() != null ? req.getProject().getFramework() : "Java + Selenium";
            String status = mapDbStatusToUiStatus(req.getStatus());

            recentProjects.add(RecentProjectDto.builder()
                    .id(req.getId())
                    .name(name)
                    .ticketKey(ticket)
                    .timeAgo(calculateTimeAgo(req.getUpdatedAt() != null ? req.getUpdatedAt() : req.getCreatedAt()))
                    .status(status)
                    .framework(framework)
                    .build());
        }

        if (recentProjects.isEmpty()) {
            List<Project> allProjects = projectRepository.findAllByOrderByCreatedAtDesc();
            for (Project p : allProjects) {
                recentProjects.add(RecentProjectDto.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .ticketKey(p.getProjectKey())
                        .timeAgo(calculateTimeAgo(p.getCreatedAt()))
                        .status("Completed")
                        .framework(p.getFramework())
                        .build());
            }
        }

        List<AuditEvent> dbAudits = auditEventRepository.findTop20ByOrderByCreatedAtDesc();
        List<RecentActivityDto> recentActivities = new ArrayList<>();

        for (AuditEvent audit : dbAudits) {
            recentActivities.add(RecentActivityDto.builder()
                    .title(audit.getDetails() != null ? audit.getDetails() : formatActionTitle(audit.getAction()))
                    .ticketKey(extractTicketOrEntity(audit))
                    .timeAgo(calculateTimeAgo(audit.getCreatedAt()))
                    .iconType(determineIconType(audit.getAction()))
                    .status(audit.getOutcome())
                    .build());
        }

        return DashboardStatsDto.builder()
                .totalProjects(projectCount)
                .testsGenerated(testsCount)
                .successfulRuns(successfulRuns)
                .pendingReviews(pendingReviews)
                .recentProjects(recentProjects)
                .recentActivities(recentActivities)
                .build();
    }

    @Transactional
    public GenerationRequest createProviderSearchDemo(User user) {
        Project project = projectRepository.findByProjectKeyIgnoreCase("PROV").orElseGet(() -> {
            Project p = Project.builder()
                    .name("Provider Portal Automation")
                    .projectKey("PROV")
                    .description("Core enterprise healthcare provider directory and credentialing tests")
                    .defaultRepoUrl("https://gitlab.com/healthtech-core/provider-portal-automation.git")
                    .defaultBranch("main")
                    .framework("Java + Selenium + Cucumber + POM")
                    .owner(user)
                    .build();
            return projectRepository.save(p);
        });

        GenerationRequest request = GenerationRequest.builder()
                .project(project)
                .user(user)
                .jiraTicketId("JIRA-1234")
                .title("Provider Search by 10-digit NPI")
                .instructionType("Jira Ticket + Screenshot")
                .status("DELIVERED")
                .targetRepo("https://gitlab.com/healthtech-core/provider-portal-automation.git")
                .targetBranch("main")
                .targetFolder("src/test/java/com/healthtech/automation")
                .requirementSummary("Search health providers by National Provider Identifier (NPI). Results display NPI, provider name, specialty, clinic location, and active status.")
                .observations("UI screenshot contains 10-digit numeric input, 'Search' button, 'Clear' button, and a sortable data table.")
                .assumptions("NPI is assumed to follow the 10-digit Luhn check standard. Unauthenticated access redirects to SSO login.")
                .build();

        GenerationRequest saved = generationRequestRepository.save(request);

        List<TestScenario> scenarios = List.of(
                TestScenario.builder()
                        .generationRequest(saved)
                        .title("Valid NPI returns matching provider record")
                        .scenarioType("Positive")
                        .description("Enter registered 10-digit NPI and verify table contains provider name, specialty, and clinic.")
                        .bddGherkin("Scenario: Search by valid NPI\n  Given the user is on the Provider Search page\n  When user enters NPI \"1093847562\" and clicks Search\n  Then the provider table displays \"Dr. Sarah Connor, MD\" with specialty \"Cardiology\"")
                        .status("APPROVED")
                        .orderIndex(1)
                        .build(),
                TestScenario.builder()
                        .generationRequest(saved)
                        .title("Invalid NPI format displays validation alert")
                        .scenarioType("Validation")
                        .description("Enter alpha-numeric or non-10-digit input and verify validation message.")
                        .bddGherkin("Scenario: Search by invalid NPI format\n  Given the user is on the Provider Search page\n  When user enters NPI \"123ABC\" and clicks Search\n  Then validation message \"NPI must be exactly 10 digits\" is displayed")
                        .status("APPROVED")
                        .orderIndex(2)
                        .build(),
                TestScenario.builder()
                        .generationRequest(saved)
                        .title("Empty search resets search or alerts user")
                        .scenarioType("Validation")
                        .description("Clicking search with empty NPI field triggers required error.")
                        .bddGherkin("Scenario: Empty NPI field search\n  Given the user is on the Provider Search page\n  When user leaves NPI blank and clicks Search\n  Then inline validation displays \"Please enter a valid NPI to search\"")
                        .status("APPROVED")
                        .orderIndex(3)
                        .build(),
                TestScenario.builder()
                        .generationRequest(saved)
                        .title("NPI with no match displays Empty State")
                        .scenarioType("Negative")
                        .description("Verify empty state illustration and 'No matching providers found' banner.")
                        .bddGherkin("Scenario: NPI with no matching record\n  Given the user is on the Provider Search page\n  When user enters unregistered NPI \"9999999999\" and clicks Search\n  Then banner \"No active providers found for NPI 9999999999\" is displayed")
                        .status("APPROVED")
                        .orderIndex(4)
                        .build(),
                TestScenario.builder()
                        .generationRequest(saved)
                        .title("Clear button resets filters and results")
                        .scenarioType("Positive")
                        .description("Clicking Clear resets NPI input and restores table to initial default state.")
                        .bddGherkin("Scenario: Reset search with Clear button\n  Given the user has searched with NPI \"1093847562\"\n  When user clicks the \"Clear\" button\n  Then the NPI input field is empty and results table is cleared")
                        .status("APPROVED")
                        .orderIndex(5)
                        .build()
        );
        testScenarioRepository.saveAll(scenarios);

        List<GeneratedArtifact> artifacts = List.of(
                GeneratedArtifact.builder()
                        .generationRequest(saved)
                        .filePath("src/test/resources/features/provider_search.feature")
                        .fileType("FEATURE")
                        .content("Feature: Healthcare Provider Search by NPI\n  Background:\n    Given user is on Provider Search\n  Scenario: Valid 10-digit NPI\n    When user enters NPI '1093847562'\n    Then provider 'Dr. Sarah Connor, MD' is displayed")
                        .language("Cucumber Gherkin")
                        .build(),
                GeneratedArtifact.builder()
                        .generationRequest(saved)
                        .filePath("src/main/java/com/healthtech/pages/ProviderSearchPage.java")
                        .fileType("PAGE_OBJECT")
                        .content("package com.healthtech.pages;\npublic class ProviderSearchPage { ... }")
                        .language("Java")
                        .build(),
                GeneratedArtifact.builder()
                        .generationRequest(saved)
                        .filePath("src/test/java/com/healthtech/steps/ProviderSearchSteps.java")
                        .fileType("STEP_DEF")
                        .content("package com.healthtech.steps;\npublic class ProviderSearchSteps { ... }")
                        .language("Java")
                        .build()
        );
        generatedArtifactRepository.saveAll(artifacts);

        ValidationRun validationRun = ValidationRun.builder()
                .generationRequest(saved)
                .status("PASSED")
                .syntaxPassed(true)
                .structurePassed(true)
                .locatorChecksPassed(true)
                .stepBindingPassed(true)
                .compilerLogs("[INFO] Compiling 3 source files\n[INFO] Cucumber feature syntax verified\n[INFO] BUILD SUCCESS")
                .executionTimeMs(1480L)
                .completedAt(LocalDateTime.now())
                .build();
        validationRunRepository.save(validationRun);

        GitDelivery delivery = GitDelivery.builder()
                .generationRequest(saved)
                .branchName("ai-generated/JIRA-1234-provider-search-tests")
                .commitSha("7f3a9e1c2b5d4f6e8a0b1c3d5e7f9a2b4c6e8f01")
                .commitMessage("test: add provider search automation for JIRA-1234")
                .mergeRequestUrl("https://gitlab.com/healthtech-core/provider-portal-automation/-/merge_requests/42")
                .status("DELIVERED")
                .deliveredAt(LocalDateTime.now())
                .build();
        gitDeliveryRepository.save(delivery);

        AuditEvent audit = AuditEvent.builder()
                .actorEmail(user.getEmail())
                .action("DELIVER_AUTOMATION_MR")
                .entityType("GenerationRequest")
                .entityId(saved.getId().toString())
                .details("Automation pushed to GitLab JIRA-1234")
                .outcome("Completed")
                .build();
        auditEventRepository.save(audit);

        Notification notification = Notification.builder()
                .userEmail(user.getEmail())
                .title("Automation Pushed to GitLab")
                .message("Merge Request #42 created for JIRA-1234 Provider Search Automation")
                .type("SUCCESS")
                .link("https://gitlab.com/healthtech-core/provider-portal-automation/-/merge_requests/42")
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        return saved;
    }

    private String mapDbStatusToUiStatus(String status) {
        if (status == null) return "Completed";
        return switch (status.toUpperCase()) {
            case "DELIVERED", "COMPLETED" -> "Completed";
            case "SCENARIOS_READY", "IN_REVIEW" -> "In Review";
            case "CODE_GENERATED" -> "Code Generated";
            case "ANALYZING" -> "Analyzing";
            default -> "In Review";
        };
    }

    private String calculateTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "recently";
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long seconds = Math.abs(duration.getSeconds());

        if (seconds < 60) {
            return "just now";
        }
        long minutes = seconds / 60;
        if (minutes < 60) {
            return minutes + " min ago";
        }
        long hours = minutes / 60;
        if (hours < 24) {
            return hours + " hr" + (hours > 1 ? "s" : "") + " ago";
        }
        long days = hours / 24;
        return days + " day" + (days > 1 ? "s" : "") + " ago";
    }

    private String formatActionTitle(String action) {
        if (action == null) return "System Activity";
        return switch (action) {
            case "DELIVER_AUTOMATION_MR" -> "Automation pushed to GitLab";
            case "CODE_GENERATION" -> "Code generation completed";
            case "SCENARIO_GENERATION" -> "Test scenarios generated";
            case "REQUIREMENT_ANALYSIS" -> "Requirement analysis started";
            default -> action.replace('_', ' ');
        };
    }

    private String determineIconType(String action) {
        if (action == null) return "start";
        String lower = action.toLowerCase();
        if (lower.contains("deliver") || lower.contains("git")) return "git";
        if (lower.contains("code")) return "code";
        if (lower.contains("scenario")) return "scenarios";
        return "start";
    }

    private String extractTicketOrEntity(AuditEvent audit) {
        if (audit.getDetails() != null && audit.getDetails().contains("JIRA-")) {
            int start = audit.getDetails().indexOf("JIRA-");
            int end = audit.getDetails().indexOf(' ', start);
            return end != -1 ? audit.getDetails().substring(start, end) : audit.getDetails().substring(start);
        }
        return "JIRA-1234";
    }
}
