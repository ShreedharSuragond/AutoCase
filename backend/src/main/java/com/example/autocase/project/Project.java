package com.example.autocase.project;

import com.example.autocase.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String projectKey;

    @Column(length = 500)
    private String description;

    @Column(length = 255)
    @Builder.Default
    private String defaultRepoUrl = "https://gitlab.com/healthtech-core/provider-portal-automation.git";

    @Column(length = 80)
    @Builder.Default
    private String defaultBranch = "main";

    @Column(length = 100)
    @Builder.Default
    private String framework = "Java + Selenium + Cucumber + POM";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
