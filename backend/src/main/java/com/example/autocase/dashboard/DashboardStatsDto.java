package com.example.autocase.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalProjects;
    private long testsGenerated;
    private long successfulRuns;
    private long pendingReviews;
    private List<RecentProjectDto> recentProjects;
    private List<RecentActivityDto> recentActivities;
}
