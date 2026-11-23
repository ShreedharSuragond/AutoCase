package com.example.autocase.automation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "validation_runs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValidationRun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generation_request_id")
    private GenerationRequest generationRequest;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PASSED";

    private boolean syntaxPassed;
    private boolean structurePassed;
    private boolean locatorChecksPassed;
    private boolean stepBindingPassed;

    @Column(columnDefinition = "TEXT")
    private String compilerLogs;

    private Long executionTimeMs;

    private LocalDateTime completedAt;
}
