package com.zerotrust.security.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ml")
public class MlInsightsController {

    @GetMapping("/stats")
    public Map<String, Object> getMlStats() {
        return Map.of(
            "accuracy", 98.4,
            "falsePositives", 1.2,
            "totalAnalyzed", 450230,
            "anomaliesDetected", 89
        );
    }

    @GetMapping("/distribution")
    public List<Map<String, Object>> getRiskDistribution() {
        return List.of(
            Map.of("name", "Low Risk (0-30)", "value", 8500),
            Map.of("name", "Medium Risk (31-60)", "value", 1200),
            Map.of("name", "High Risk (61-89)", "value", 250),
            Map.of("name", "Critical (90+)", "value", 50)
        );
    }

    @PostMapping("/train-model")
    public Map<String, Object> triggerRetrain() {
        return Map.of("status", "success", "message", "Model retraining initiated in the background.");
    }
}
