package com.zerotrust.security.controller;

import com.zerotrust.security.service.AuditService;
import com.zerotrust.security.service.DlpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private DlpService dlpService;

    @Autowired
    private AuditService auditService;

    @GetMapping("/sensitive")
    public List<String> getSensitiveData(Authentication authentication) {
        String username = authentication.getName();
        auditService.logAction(username, "READ_SENSITIVE_DATA", "Accessed customer records");

        List<String> rawData = List.of(
            "Customer 1: SSN 123-45-6789, Email john.doe@example.com",
            "Customer 2: Phone 555-123-4567, Email jane.smith@company.org"
        );

        // Apply DLP masking based on user role (Admin and Analyst can see raw data)
        boolean hasClearance = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ANALYST") || a.getAuthority().equals("ROLE_ADMIN"));

        if (!hasClearance) {
            // Mask data for non-analysts
            return rawData.stream()
                    .map(dlpService::maskSensitiveData)
                    .toList();
        }

        return rawData;
    }

    @Autowired
    private com.zerotrust.security.repository.AuditLogRepository auditLogRepository;

    @GetMapping("/audits")
    public List<com.zerotrust.security.model.AuditLog> getRecentAudits(Authentication authentication) {
        boolean isAnalyst = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ANALYST") || a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAnalyst) {
            return List.of(); // Only Analysts/Admins can see audit logs
        }

        return auditLogRepository.findTop10ByOrderByTimestampDesc();
    }
}
