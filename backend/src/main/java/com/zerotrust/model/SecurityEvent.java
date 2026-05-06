package com.zerotrust.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "security_events")
public class SecurityEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String type; // ANOMALY, DATA_ACCESS, LOGIN, etc.
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW
    private String message;
    private String userId;
    private int riskScore;
    private String status; // ACTIVE, RESOLVED, BLOCKED
    private String eventHash; // SHA-256 integrity hash
    private LocalDateTime timestamp;
}
