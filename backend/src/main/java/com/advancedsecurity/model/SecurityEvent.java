package com.advancedsecurity.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String type; // ANOMALY, DATA_ACCESS, LOGIN, etc.
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW
    private String message;
    private String userId;
    private int riskScore;
    private String status; // ACTIVE, RESOLVED, BLOCKED
    private String eventHash; // SHA-256 integrity hash
    private String timestamp; // Firestore works better with Strings or specific Timestamp objects
}
