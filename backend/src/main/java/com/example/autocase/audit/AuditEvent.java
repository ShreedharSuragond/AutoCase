package com.example.autocase.audit;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String actorEmail;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(length = 50)
    private String entityType;

    @Column(length = 100)
    private String entityId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(length = 50)
    @Builder.Default
    private String outcome = "SUCCESS";

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
