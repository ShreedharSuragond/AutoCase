package com.example.autocase.automation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GenerationRequestRepository extends JpaRepository<GenerationRequest, UUID> {
    List<GenerationRequest> findAllByOrderByCreatedAtDesc();
    List<GenerationRequest> findTop5ByOrderByCreatedAtDesc();
}
