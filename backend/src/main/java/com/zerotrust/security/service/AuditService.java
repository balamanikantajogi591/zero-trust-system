package com.zerotrust.security.service;

import com.zerotrust.security.model.AuditLog;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;

@Service
public class AuditService {

    // Usually injected Repository
    // @Autowired private AuditLogRepository repo;

    public void logAction(String username, String action, String details) {
        AuditLog log = new AuditLog();
        log.setUsername(username);
        log.setAction(action);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        
        // Generate SHA-256 hash
        String dataToHash = username + action + details + log.getTimestamp().toString();
        log.setHash(generateHash(dataToHash));

        // repo.save(log);
        System.out.println("Audit Logged: [" + log.getHash() + "] " + username + " performed " + action);
    }

    private String generateHash(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return "HASH_ERROR";
        }
    }
}
