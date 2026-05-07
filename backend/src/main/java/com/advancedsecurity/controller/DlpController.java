package com.advancedsecurity.controller;

import com.advancedsecurity.model.SecurityEvent;
import com.advancedsecurity.repository.SecurityEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dlp")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DlpController {

    private final SecurityEventRepository eventRepository;

    @GetMapping("/logs")
    public ResponseEntity<List<SecurityEvent>> getDlpLogs() {
        List<SecurityEvent> logs = eventRepository.findAll().stream()
                .filter(event -> "DLP_MASKED".equals(event.getType()))
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDlpStats() {
        List<SecurityEvent> allEvents = eventRepository.findAll();
        
        long maskedCount = allEvents.stream()
                .filter(e -> "DLP_MASKED".equals(e.getType()))
                .count();
                
        long blockedCount = allEvents.stream()
                .filter(e -> "ANOMALY_DETECTED".equals(e.getType()) && e.getRiskScore() > 90)
                .count();

        return ResponseEntity.ok(Map.of(
            "inspectedObjects", allEvents.size() * 12, // Simulating a higher inspection rate
            "maskedPatterns", maskedCount,
            "blockedTransfers", blockedCount
        ));
    }
}
