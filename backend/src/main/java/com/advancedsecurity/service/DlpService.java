package com.advancedsecurity.service;

import com.advancedsecurity.model.SecurityEvent;
import com.advancedsecurity.repository.SecurityEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
@RequiredArgsConstructor
public class DlpService {

    private final SecurityEventRepository eventRepository;

    private static final String EMAIL_PATTERN = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}";
    private static final String PHONE_PATTERN = "\\d{10}|\\+\\d{1,2}\\s\\d{10}";
    private static final String SSN_PATTERN = "\\d{3}-\\d{2}-\\d{4}";

    public String inspectAndMask(String data) {
        return inspectAndMask(data, "system-process", "Internal System Data");
    }

    public String inspectAndMask(String data, String userId, String resourceName) {
        String maskedData = data;
        boolean detected = false;
        StringBuilder patternsFound = new StringBuilder();

        if (containsPattern(data, EMAIL_PATTERN)) {
            maskedData = maskPattern(maskedData, EMAIL_PATTERN, "email");
            patternsFound.append("Email ");
            detected = true;
        }
        if (containsPattern(data, PHONE_PATTERN)) {
            maskedData = maskPattern(maskedData, PHONE_PATTERN, "phone");
            patternsFound.append("Phone ");
            detected = true;
        }
        if (containsPattern(data, SSN_PATTERN)) {
            maskedData = maskPattern(maskedData, SSN_PATTERN, "id");
            patternsFound.append("SSN ");
            detected = true;
        }

        if (detected) {
            logDlpEvent(userId, resourceName, patternsFound.toString().trim());
        }
        
        return maskedData;
    }

    private void logDlpEvent(String userId, String resourceName, String pattern) {
        SecurityEvent event = SecurityEvent.builder()
                .type("DLP_MASKED")
                .severity("MEDIUM")
                .userId(userId)
                .message("Sensitive data (" + pattern + ") detected and masked in: " + resourceName)
                .timestamp(java.time.LocalDateTime.now().toString())
                .status("COMPLETED")
                .riskScore(40)
                .build();
        eventRepository.save(event);
    }

    private boolean containsPattern(String text, String regex) {
        return Pattern.compile(regex).matcher(text).find();
    }

    private String maskPattern(String text, String regex, String label) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);
        StringBuilder sb = new StringBuilder();
        int lastEnd = 0;
        
        while (matcher.find()) {
            sb.append(text, lastEnd, matcher.start());
            sb.append("[REDACTED-").append(label.toUpperCase()).append("]");
            lastEnd = matcher.end();
        }
        sb.append(text.substring(lastEnd));
        return sb.toString();
    }

    public boolean containsSensitiveData(String data) {
        return containsPattern(data, EMAIL_PATTERN) ||
               containsPattern(data, PHONE_PATTERN) ||
               containsPattern(data, SSN_PATTERN);
    }
}
