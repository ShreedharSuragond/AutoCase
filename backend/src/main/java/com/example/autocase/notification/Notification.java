package com.example.autocase.notification;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String userEmail;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(length = 50)
    @Builder.Default
    private String type = "INFO";

    @Column(nullable = false)
    @Builder.Default
    private boolean isRead = false;

    @Column(length = 255)
    private String link;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
