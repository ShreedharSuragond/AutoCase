package com.example.autocase.automation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GeneratedArtifactRepository extends JpaRepository<GeneratedArtifact, UUID> {
    List<GeneratedArtifact> findByGenerationRequestId(UUID requestId);
}
