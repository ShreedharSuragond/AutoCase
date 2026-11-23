package com.example.autocase.automation;

import com.example.autocase.project.Project;
import com.example.autocase.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "generation_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 50)
    private String jiraTicketId;

    @Column(length = 50)
    private String gitlabIssueId;

    @Column(length = 50)
    @Builder.Default
    private String instructionType = "Jira Ticket + Screenshot";

    @Column(length = 200)
    private String title;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "DRAFT";

    @Column(length = 255)
    private String targetRepo;

    @Column(length = 100)
    private String targetBranch;

    @Column(length = 255)
    private String targetFolder;

    @Column(columnDefinition = "TEXT")
    private String requirementSummary;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(columnDefinition = "TEXT")
    private String assumptions;

    @OneToMany(mappedBy = "generationRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TestScenario> scenarios = new ArrayList<>();

    @OneToMany(mappedBy = "generationRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GeneratedArtifact> artifacts = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
