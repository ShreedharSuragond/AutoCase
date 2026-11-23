package com.example.autocase.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID id;
    private String email;
    private String fullName;
    private String team;
    private String status;
    private List<String> roles;
    private Set<String> permissions;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
}
