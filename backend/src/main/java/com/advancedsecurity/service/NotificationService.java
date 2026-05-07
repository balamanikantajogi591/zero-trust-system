package com.advancedsecurity.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendAlert(String title, String message, String severity) {
        Map<String, String> alert = Map.of(
            "title", title,
            "message", message,
            "severity", severity,
            "timestamp", java.time.LocalDateTime.now().toString()
        );
        messagingTemplate.convertAndSend("/topic/alerts", alert);
    }
}
