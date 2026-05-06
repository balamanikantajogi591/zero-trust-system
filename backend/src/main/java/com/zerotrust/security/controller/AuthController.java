package com.zerotrust.security.controller;

import com.zerotrust.security.dto.AuthRequest;
import com.zerotrust.security.dto.AuthResponse;
import com.zerotrust.security.dto.RegisterRequest;
import com.zerotrust.security.dto.GoogleLoginRequest;
import com.zerotrust.security.model.User;
import com.zerotrust.security.repository.UserRepository;
import com.zerotrust.security.repository.RoleRepository;
import com.zerotrust.security.model.Role;
import com.zerotrust.security.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.Collections;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final RestTemplate restTemplate = new RestTemplate();

    private void checkRiskScore(String username, int hourOfDay, int downloadCount, int failedLogins, AuthResponse response) {
        try {
            String mlUrl = System.getenv("ML_SERVICE_URL");
            if (mlUrl == null || mlUrl.isEmpty()) {
                mlUrl = "http://localhost:8000/predict-risk"; 
            }
            Map<String, Object> mlRequest = Map.of(
                    "user_id", username,
                    "hour_of_day", hourOfDay,
                    "download_count", downloadCount,
                    "failed_logins", failedLogins
            );
            @SuppressWarnings("unchecked")
            Map<String, Object> mlResponse = restTemplate.postForObject(mlUrl, mlRequest, Map.class);
            
            if (mlResponse != null && mlResponse.containsKey("risk_score")) {
                int riskScore = (int) mlResponse.get("risk_score");
                response.setRiskScore(riskScore);
                if (riskScore > 50 || (boolean) mlResponse.get("is_anomaly")) {
                    response.setMfaRequired(true);
                }
            }
        } catch (Exception e) {
            System.out.println("ML service unavailable: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already registered!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Default role is always ROLE_USER
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        
        // Only special email gets ROLE_ADMIN during registration (for setup/demonstration)
        // In a real production app, this would be restricted further
        if ("balamanikantajogi591@gmail.com".equalsIgnoreCase(request.getEmail())) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            user.setRoles(Set.of(userRole, adminRole));
        } else {
            user.setRoles(Collections.singleton(userRole));
        }
        
        user.setMfaEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        
        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            AuthResponse response = new AuthResponse(null, request.getUsername(), 0, false);
            checkRiskScore(request.getUsername(), request.getHourOfDay(), request.getDownloadCount(), request.getFailedLogins(), response);

            List<SimpleGrantedAuthority> authorities = userOpt.get().getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority(role.getName()))
                    .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    request.getUsername(), null, authorities);
            response.setToken(jwtTokenProvider.generateToken(auth));

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        // Here we would normally verify the Google ID token using Google API Client.
        // For demonstration, we trust the simulated token payload from the frontend.
        String email = request.getEmail();
        String username = email.split("@")[0]; // Generate a simple username

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isEmpty()) {
            user = new User();
            user.setUsername(username);
            user.setEmail(email);
            // Generate a random password since they login via Google
            user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            
            // Default role is always ROLE_USER
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();

            if ("balamanikantajogi591@gmail.com".equalsIgnoreCase(email)) {
                Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
                user.setRoles(Set.of(userRole, adminRole));
            } else {
                user.setRoles(Collections.singleton(userRole));
            }
            
            user.setMfaEnabled(true);
            userRepository.save(user);
        } else {
            user = userOpt.get();
        }

        AuthResponse response = new AuthResponse(null, user.getUsername(), 0, false);
        
        // MFA Enforcement: If it's a sensitive user (like admin), always require MFA
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));
        if (isAdmin) {
            response.setMfaRequired(true);
        }
        
        checkRiskScore(user.getUsername(), request.getHourOfDay(), request.getDownloadCount(), request.getFailedLogins(), response);

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                user.getUsername(), null, authorities);
        response.setToken(jwtTokenProvider.generateToken(auth));

        return ResponseEntity.ok(response);
    }
}
