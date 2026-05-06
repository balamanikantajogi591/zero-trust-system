package com.zerotrust.controller;

import com.zerotrust.model.SecurityEvent;
import com.zerotrust.repository.SecurityEventRepository;
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
    public ResponseEntity<List<SecurityEvent>> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAllByOrderByTimestampDesc());
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<SecurityEvent> resolveEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(event -> {
                    event.setStatus("RESOLVED");
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
