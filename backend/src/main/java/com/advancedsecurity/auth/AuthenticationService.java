package com.advancedsecurity.auth;

import com.advancedsecurity.model.User;
import com.advancedsecurity.repository.UserRepository;
import com.advancedsecurity.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final com.advancedsecurity.service.ThreatIntelligenceService threatIntelligenceService;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(com.advancedsecurity.model.Role.USER) // Force USER role for all registrations
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        // Advanced Security Adaptive Check with Context
        String userAgent = httpRequest.getHeader("User-Agent");
        int riskScore = threatIntelligenceService.predictRisk(user.getEmail(), Map.of(
            "hour_of_day", java.time.LocalTime.now().getHour(),
            "login_frequency", 1.0, 
            "data_download_size", 0.0,
            "device_reputation", userAgent != null && userAgent.contains("Mobile") ? 0.8 : 1.0
        ));

        if (riskScore > 85) { // Slightly higher threshold for context-aware scoring
            throw new com.advancedsecurity.exception.AdaptiveAuthenticationException(
                "Access Denied: AI Security Engine detected a high-risk login anomaly (Score: " + riskScore + ")"
            );
        }

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }
}
