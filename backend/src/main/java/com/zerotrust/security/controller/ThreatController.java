package com.zerotrust.security.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/threats")
public class ThreatController {

    @GetMapping
    public List<Map<String, Object>> getThreats() {
        return List.of(
            Map.of("id", "T-1001", "date", "2026-05-06T10:15:00Z", "user", "UNKNOWN", "severity", "Critical", "riskScore", 95, "details", "Multiple failed logins from blocked IP range (China)."),
            Map.of("id", "T-1002", "date", "2026-05-06T09:42:00Z", "user", "bsmith", "severity", "High", "riskScore", 82, "details", "Anomalous download spike. Triggered MFA."),
            Map.of("id", "T-1003", "date", "2026-05-06T08:12:00Z", "user", "jdoe", "severity", "Medium", "riskScore", 55, "details", "Login from unusual geographical location (New York)."),
            Map.of("id", "T-1004", "date", "2026-05-06T07:05:00Z", "user", "admin", "severity", "Low", "riskScore", 12, "details", "Routine background ping.")
        );
    }

    @GetMapping("/{id}")
    public Map<String, Object> getThreatDetails(@PathVariable String id) {
        return Map.of("id", id, "status", "Investigating", "actionSuggested", "Block IP and Force Password Reset");
    }
}
