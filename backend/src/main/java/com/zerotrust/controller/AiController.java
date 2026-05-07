package com.zerotrust.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${application.ml-service.url:http://localhost:8000}")
    private String mlServiceUrl;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('ANALYST')")
    public ResponseEntity<Map<String, Object>> getAiStats() {
        try {
            Map<String, Object> stats = restTemplate.getForObject(mlServiceUrl + "/stats", Map.class);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/train")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Object>> trainModel() {
        try {
            Map<String, Object> response = restTemplate.postForObject(mlServiceUrl + "/train", null, Map.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
