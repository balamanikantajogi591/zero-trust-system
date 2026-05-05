package com.zerotrust.security.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping
    public List<Map<String, Object>> getNotifications() {
        return List.of(
            Map.of("id", 1, "title", "High Risk Login Detected", "message", "User 'jdoe' attempted login from an unfamiliar IP.", "severity", "High", "read", false, "timestamp", "10 mins ago"),
            Map.of("id", 2, "title", "DLP Policy Triggered", "message", "Masked 2 SSNs in outgoing response.", "severity", "Medium", "read", false, "timestamp", "1 hour ago"),
            Map.of("id", 3, "title", "System Update Complete", "message", "ML models have been retrained with 98.4% accuracy.", "severity", "Info", "read", true, "timestamp", "2 days ago")
        );
    }

    @PutMapping("/{id}/read")
    public Map<String, Object> markAsRead(@PathVariable Long id) {
        return Map.of("status", "success", "message", "Notification " + id + " marked as read");
    }
}
