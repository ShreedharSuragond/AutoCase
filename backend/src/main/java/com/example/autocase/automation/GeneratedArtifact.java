package com.example.autocase.automation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "generated_artifacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneratedArtifact {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generation_request_id")
    private GenerationRequest generationRequest;

    @Column(nullable = false, length = 255)
    private String filePath;

    @Column(nullable = false, length = 50)
    private String fileType;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 50)
    @Builder.Default
    private String language = "Java";
}
