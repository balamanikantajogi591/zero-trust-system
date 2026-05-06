package com.zerotrust.security.controller;

import com.zerotrust.security.dto.AuthRequest;
import com.zerotrust.security.dto.AuthResponse;
import com.zerotrust.security.dto.RegisterRequest;
import com.zerotrust.security.dto.GoogleLoginRequest;
import com.zerotrust.security.model.User;
import com.zerotrust.security.repository.UserRepository;
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

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

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
        
        if ("balamanikantajogi591@gmail.com".equalsIgnoreCase(request.getEmail())) {
            user.setRole("ROLE_ADMIN");
        } else {
            user.setRole("ROLE_USER");
        }
        
        user.setMfaEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            User user = userRepository.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));

            if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }

            // In a real app, generate a real JWT here
            String token = "mock-jwt-token-" + System.currentTimeMillis();
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole(),
                "email", user.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
    }

    @GetMapping("/risk-score")
    public ResponseEntity<?> getRiskScore(@RequestParam String email) {
        // Simulated ML logic: Return high risk for certain domains or patterns
        int score = (email.contains("test") || email.length() > 25) ? 85 : 12;
        String level = score > 50 ? "High" : "Low";
        return ResponseEntity.ok(Map.of(
            "email", email,
            "riskScore", score,
            "trustLevel", level,
            "recommendation", level.equals("High") ? "Require MFA" : "Allow Direct Access"
        ));
    }
}
