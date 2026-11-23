package com.example.autocase.automation;

import com.example.autocase.audit.AuditEvent;
import com.example.autocase.audit.AuditEventRepository;
import com.example.autocase.common.ApiResponse;
import com.example.autocase.notification.Notification;
import com.example.autocase.notification.NotificationRepository;
import com.example.autocase.auth.UserPrincipal;
import com.example.autocase.user.User;
import com.example.autocase.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AutomationController {

    private final AutomationService automationService;
    private final GenerationRequestRepository generationRequestRepository;
    private final NotificationRepository notificationRepository;
    private final AuditEventRepository auditEventRepository;
    private final UserRepository userRepository;

    @GetMapping("/generations/latest")
    public ResponseEntity<ApiResponse<GenerationRequest>> getLatestGeneration() {
        List<GenerationRequest> list = generationRequestRepository.findTop5ByOrderByCreatedAtDesc();
        if (list.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(null, "No requests found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(list.get(0)));
    }

    @PostMapping("/generations/demo-seed")
    public ResponseEntity<ApiResponse<GenerationRequest>> seedDemo(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        User user = null;
        if (principal != null) {
            user = userRepository.findById(principal.getId()).orElse(null);
        }
        if (user == null) {
            user = userRepository.findByEmailIgnoreCase("automation.user@autocase.ai").orElse(null);
        }

        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User not found for demo seed"));
        }

        GenerationRequest request = automationService.createProviderSearchDemo(user);
        return ResponseEntity.ok(ApiResponse.ok(request, "Provider Search Demo workflow created"));
    }

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String email = principal != null ? principal.getEmail() : "automation.user@autocase.ai";
        List<Notification> notifications = notificationRepository.findAllByUserEmailOrderByCreatedAtDesc(email);
        return ResponseEntity.ok(ApiResponse.ok(notifications));
    }

    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markNotificationRead(@PathVariable UUID id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok(ApiResponse.ok(null, "Marked as read"));
    }

    @GetMapping("/admin/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditEvent>>> getAuditLogs() {
        List<AuditEvent> logs = auditEventRepository.findTop20ByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }
}
