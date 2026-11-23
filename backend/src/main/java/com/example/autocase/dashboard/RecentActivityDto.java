package com.example.autocase.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityDto {
    private String title;
    private String ticketKey;
    private String timeAgo;
    private String iconType;
    private String status;
}
