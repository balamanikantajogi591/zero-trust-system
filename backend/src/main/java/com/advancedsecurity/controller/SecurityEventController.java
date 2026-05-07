package com.advancedsecurity.controller;

import com.advancedsecurity.model.SecurityEvent;
import com.advancedsecurity.repository.SecurityEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SecurityEventController {

    private final SecurityEventRepository eventRepository;

    @GetMapping
    public ResponseEntity<List<SecurityEvent>> getAllEvents(@RequestParam(required = false) String severity) {
        if (severity != null && !severity.isEmpty()) {
            return ResponseEntity.ok(eventRepository.findBySeverity(severity));
        }
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<SecurityEvent> resolveEvent(@PathVariable String id) {
        return eventRepository.findById(id)
                .map(event -> {
                    event.setStatus("RESOLVED");
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
