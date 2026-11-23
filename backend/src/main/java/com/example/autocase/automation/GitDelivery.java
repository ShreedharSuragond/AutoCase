package com.example.autocase.automation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "git_deliveries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GitDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generation_request_id")
    private GenerationRequest generationRequest;

    @Column(nullable = false, length = 255)
    private String branchName;

    @Column(length = 64)
    private String commitSha;

    @Column(length = 500)
    private String commitMessage;

    @Column(length = 500)
    private String mergeRequestUrl;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "DELIVERED";

    private LocalDateTime deliveredAt;
}
