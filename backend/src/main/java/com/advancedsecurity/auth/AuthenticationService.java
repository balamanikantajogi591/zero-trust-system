package com.advancedsecurity.auth;

import com.advancedsecurity.model.Role;
import com.advancedsecurity.model.User;
import com.advancedsecurity.repository.UserRepository;
import com.advancedsecurity.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final com.advancedsecurity.service.ThreatIntelligenceService threatIntelligenceService;

    /**
     * Admin-only login.
     * Authenticates credentials via Spring Security, then enforces ADMIN role.
     * Returns 403 with a clear message if the account is not ADMIN.
     */
    public ResponseEntity<?> adminLogin(AuthenticationRequest request,
                                        jakarta.servlet.http.HttpServletRequest httpRequest) {
        // Step 1: Authenticate credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Step 2: Load user
        var user = repository.findByEmail(request.getEmail()).orElseThrow();

        // Step 3: Enforce ADMIN role — reject all other roles
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access Restricted: Admins Only. Your account does not have admin privileges."));
        }

        // Step 4: AI Risk check (skip for admin to avoid false positives on demo)
        String userAgent = httpRequest.getHeader("User-Agent");
        int riskScore = threatIntelligenceService.predictRisk(user.getEmail(), Map.of(
                "hour_of_day", java.time.LocalTime.now().getHour(),
                "login_frequency", 1.0,
                "data_download_size", 0.0,
                "device_reputation", userAgent != null && userAgent.contains("Mobile") ? 0.8 : 1.0
        ));

        if (riskScore > 95) { // Very high threshold for admin — only block extreme anomalies
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "AI Security Engine: Extreme risk anomaly detected (Score: " + riskScore + "). Access denied."));
        }

        // Step 5: Issue tokens
        var jwtToken = jwtService.generateToken(user);

        return ResponseEntity.ok(Map.of(
                "token", jwtToken,
                "role", user.getRole().name(),
                "username", (user.getFirstname() != null ? user.getFirstname() : "") + " " +
                            (user.getLastname() != null ? user.getLastname() : ""),
                "email", user.getEmail(),
                "lastLogin", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        ));
    }

    /**
     * Legacy authenticate — kept for backward compatibility.
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request,
                                               jakarta.servlet.http.HttpServletRequest httpRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * Public registration — kept but now only creates USER roles.
     */
    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .status("Active")
                .riskScore(10)
                .mfaEnabled(false)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }
}
