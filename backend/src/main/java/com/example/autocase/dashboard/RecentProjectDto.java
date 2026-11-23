package com.example.autocase.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentProjectDto {
    private UUID id;
    private String name;
    private String ticketKey;
    private String timeAgo;
    private String status;
    private String framework;
}
