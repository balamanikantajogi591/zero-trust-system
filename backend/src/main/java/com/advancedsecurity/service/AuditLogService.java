package com.advancedsecurity.service;

import com.advancedsecurity.model.SecurityEvent;
import com.advancedsecurity.model.AuditLog;
import com.advancedsecurity.repository.SecurityEventRepository;
import com.advancedsecurity.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final SecurityEventRepository eventRepository;
    private final AuditLogRepository auditLogRepository;

    public void logAction(String userId, String action, String details) {
        String dataToHash = userId + action + details + System.currentTimeMillis();
        String hash = generateHash(dataToHash);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        
        SecurityEvent event = SecurityEvent.builder()
                .userId(userId)
                .type(action)
                .message(details)
                .eventHash(hash)
                .timestamp(timestamp)
                .status("COMPLETED")
                .severity("INFO")
                .build();
        
        eventRepository.save(event);

        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .action(action)
                .details(details)
                .hash(hash)
                .timestamp(timestamp)
                .build();
        auditLogRepository.save(auditLog);
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
        String rawData = log.getUserId() + log.getAction() + log.getDetails() + log.getTimestamp();
        String currentHash = generateHash(rawData);
        return currentHash.equals(log.getHash());
    }
}
