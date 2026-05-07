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
     * Unified login for all roles.
     * Authenticates credentials via Spring Security.
     */
    public ResponseEntity<?> login(AuthenticationRequest request,
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

        // Step 3: AI Risk check
        String userAgent = httpRequest.getHeader("User-Agent");
        int riskScore = threatIntelligenceService.predictRisk(user.getEmail(), Map.of(
                "hour_of_day", java.time.LocalTime.now().getHour(),
                "login_frequency", 1.0,
                "data_download_size", 0.0,
                "device_reputation", userAgent != null && userAgent.contains("Mobile") ? 0.8 : 1.0
        ));

        if (riskScore > 98) { // Very high threshold — only block extreme anomalies
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "AI Security Engine: Extreme risk anomaly detected (Score: " + riskScore + "). Access denied."));
        }

        // Step 4: Issue tokens
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
