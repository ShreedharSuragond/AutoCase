package com.example.autocase.automation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TestScenarioRepository extends JpaRepository<TestScenario, UUID> {
    List<TestScenario> findByGenerationRequestIdOrderByOrderIndexAsc(UUID requestId);
    long countByStatusIgnoreCase(String status);
}
