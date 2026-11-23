package com.example.autocase.automation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "test_scenarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestScenario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generation_request_id")
    private GenerationRequest generationRequest;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 50)
    @Builder.Default
    private String scenarioType = "Positive";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String bddGherkin;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "APPROVED";

    private Integer orderIndex;
}
