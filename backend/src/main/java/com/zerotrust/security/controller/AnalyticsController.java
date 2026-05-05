package com.zerotrust.security.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @GetMapping("/attack-trends")
    public List<Map<String, Object>> getAttackTrends() {
        return List.of(
            Map.of("month", "Jan", "bruteForce", 120, "anomalousLogin", 45, "dlpTriggers", 30),
            Map.of("month", "Feb", "bruteForce", 90, "anomalousLogin", 55, "dlpTriggers", 25),
            Map.of("month", "Mar", "bruteForce", 150, "anomalousLogin", 60, "dlpTriggers", 40),
            Map.of("month", "Apr", "bruteForce", 80, "anomalousLogin", 35, "dlpTriggers", 20),
            Map.of("month", "May", "bruteForce", 110, "anomalousLogin", 50, "dlpTriggers", 45)
        );
    }

    @GetMapping("/geo-distribution")
    public List<Map<String, Object>> getGeoDistribution() {
        return List.of(
            Map.of("country", "US", "logins", 4500, "threats", 12),
            Map.of("country", "UK", "logins", 850, "threats", 3),
            Map.of("country", "China", "logins", 120, "threats", 85),
            Map.of("country", "Russia", "logins", 45, "threats", 40)
        );
    }
}
