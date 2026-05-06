package com.zerotrust.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecurityEvent {

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
