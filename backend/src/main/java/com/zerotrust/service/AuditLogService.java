package com.zerotrust.service;

import com.zerotrust.model.SecurityEvent;
import com.zerotrust.repository.SecurityEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final SecurityEventRepository eventRepository;

    public void logAction(String userId, String action, String details) {
        String dataToHash = userId + action + details + System.currentTimeMillis();
        String hash = generateHash(dataToHash);
        
        SecurityEvent event = SecurityEvent.builder()
                .userId(userId)
                .type(action)
                .message(details)
                .eventHash(hash)
                .timestamp(LocalDateTime.now())
                .status("COMPLETED")
                .severity("INFO")
                .build();
        
        eventRepository.save(event);
    }

    private String generateHash(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating audit hash", e);
        }
    }

    public boolean verifyIntegrity(AuditLog log) {
        String rawData = log.getUserId() + log.getAction() + log.getDetails() + log.getTimestamp().toString();
        String currentHash = generateHash(rawData);
        return currentHash.equals(log.getHash());
    }
}
