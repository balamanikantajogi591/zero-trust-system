package com.advancedsecurity.config;

import com.advancedsecurity.model.Role;
import com.advancedsecurity.model.User;
import com.advancedsecurity.model.SecurityEvent;
import com.advancedsecurity.model.AuditLog;
import com.advancedsecurity.repository.UserRepository;
import com.advancedsecurity.repository.SecurityEventRepository;
import com.advancedsecurity.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SecurityEventRepository eventRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "balamanikantajogi591@gmail.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .firstname("Mani")
                    .lastname("047")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Mani047@"))
                    .role(Role.ADMIN)
                    .mfaEnabled(true)
                    .status("Active")
                    .riskScore(0)
                    .build();
            userRepository.save(admin);
            System.out.println("CRITICAL: ADMIN USER CREATED -> " + adminEmail);
        }

        // Seed diverse demo users
        seedDemoUsers();

        if (eventRepository.findAll().isEmpty()) {
            seedEvents();
            System.out.println("INFO: MOCK SECURITY EVENTS SEEDED");
        }

        if (auditLogRepository.findAll().isEmpty()) {
            seedAuditLogs();
            System.out.println("INFO: MOCK AUDIT LOGS SEEDED");
        }
    }

    private void seedDemoUsers() {
        Object[][] demoUsers = {
            {"Alice", "Johnson", "alice.johnson@securecorp.com", "ANALYST", "Active", 22},
            {"Bob", "Smith", "bob.smith@securecorp.com", "USER", "Active", 45},
            {"Carol", "Davis", "carol.davis@securecorp.com", "USER", "Active", 10},
            {"Dave", "Wilson", "dave.wilson@securecorp.com", "USER", "Suspended", 88},
            {"Eve", "Martinez", "eve.martinez@securecorp.com", "ANALYST", "Active", 31},
        };
        for (Object[] u : demoUsers) {
            String email = (String) u[2];
            if (userRepository.findByEmail(email).isEmpty()) {
                userRepository.save(User.builder()
                    .firstname((String) u[0])
                    .lastname((String) u[1])
                    .email(email)
                    .password(passwordEncoder.encode("Welcome@123"))
                    .role(Role.valueOf((String) u[3]))
                    .status((String) u[4])
                    .riskScore((Integer) u[5])
                    .mfaEnabled(false)
                    .build());
            }
        }
    }


    private void seedEvents() {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        List<SecurityEvent> events = List.of(
            SecurityEvent.builder()
                .type("ANOMALY")
                .severity("CRITICAL")
                .message("Unauthorized access attempt to Finance DB from unknown IP 192.168.4.12")
                .userId("guest")
                .riskScore(95)
                .status("ACTIVE")
                .timestamp(LocalDateTime.now().minusHours(2).format(formatter))
                .build(),
            SecurityEvent.builder()
                .type("DATA_ACCESS")
                .severity("HIGH")
                .message("Unusual data export detected: 2.5GB downloaded by user ID 407")
                .userId("407")
                .riskScore(75)
                .status("ACTIVE")
                .timestamp(LocalDateTime.now().minusHours(5).format(formatter))
                .build(),
            SecurityEvent.builder()
                .type("LOGIN")
                .severity("MEDIUM")
                .message("Brute force attempt detected on admin account")
                .userId("admin")
                .riskScore(45)
                .status("BLOCKED")
                .timestamp(LocalDateTime.now().minusDays(1).format(formatter))
                .build()
        );
        events.forEach(eventRepository::save);
    }

    private void seedAuditLogs() {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        List<AuditLog> logs = List.of(
            AuditLog.builder()
                .userId("balamanikantajogi591@gmail.com")
                .action("USER_LOGIN")
                .details("Admin login verified via Google OAuth")
                .timestamp(LocalDateTime.now().minusHours(1).format(formatter))
                .build(),
            AuditLog.builder()
                .userId("balamanikantajogi591@gmail.com")
                .action("POLICY_UPDATE")
                .details("Updated DLP masking rules for PII data")
                .timestamp(LocalDateTime.now().minusHours(3).format(formatter))
                .build()
        );
        logs.forEach(auditLogRepository::save);
    }
}
