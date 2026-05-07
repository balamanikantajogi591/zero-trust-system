package com.zerotrust.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ThreatIntelligenceService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Value("${application.ml-service.url:http://localhost:8000}")
    private String mlServiceUrl;

    public int predictRisk(String userId, Map<String, Object> activityData) {
        try {
            // Activity Data structure for ML: [hour_of_day, login_frequency, data_download_size, device_reputation]
            Map<String, Object> requestBody = Map.of(
                "user_id", userId,
                "hour_of_day", activityData.getOrDefault("hour_of_day", 12),
                "login_frequency", activityData.getOrDefault("login_frequency", 1.0),
                "data_download_size", activityData.getOrDefault("data_download_size", 0.0),
                "device_reputation", activityData.getOrDefault("device_reputation", 1.0)
            );

            Map<String, Object> response = restTemplate.postForObject(
                mlServiceUrl + "/predict-risk", 
                requestBody, 
                Map.class
            );

            int riskScore = (int) response.get("risk_score");
            boolean isAnomaly = (boolean) response.get("is_anomaly");

            if (isAnomaly || riskScore > 70) {
                notificationService.sendAlert(
                    "High Risk Detected", 
                    "User " + userId + " exhibits suspicious behavior. Risk Score: " + riskScore, 
                    "CRITICAL"
                );
                auditLogService.logAction(userId, "ANOMALY_DETECTED", "Risk score: " + riskScore);
            }

            return riskScore;
        } catch (Exception e) {
            System.err.println("Error calling ML service: " + e.getMessage());
            return 50; // Default moderate risk if ML service fails
        }
    }
}
