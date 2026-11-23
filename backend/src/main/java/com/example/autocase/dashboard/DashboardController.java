package com.example.autocase.dashboard;

import com.example.autocase.automation.AutomationService;
import com.example.autocase.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AutomationService automationService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats() {
        DashboardStatsDto stats = automationService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
