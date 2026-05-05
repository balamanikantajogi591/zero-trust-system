package com.zerotrust.security.controller;

import com.zerotrust.security.dto.AuthRequest;
import com.zerotrust.security.dto.AuthResponse;
import com.zerotrust.security.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // A simple RestTemplate for ML service call (in production use WebClient or Feign)
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // Mock authentication process
        if ("admin".equals(request.getUsername()) && "password".equals(request.getPassword())) {
            
            // Call ML service to get risk score
            int riskScore = 0;
            boolean mfaRequired = false;
            try {
                String mlUrl = "http://localhost:8000/predict-risk"; // Docker environment url injected via config in real app
                Map<String, Object> mlRequest = Map.of(
                        "user_id", request.getUsername(),
                        "hour_of_day", request.getHourOfDay(),
                        "download_count", request.getDownloadCount(),
                        "failed_logins", request.getFailedLogins()
                );
                @SuppressWarnings("unchecked")
                Map<String, Object> mlResponse = restTemplate.postForObject(mlUrl, mlRequest, Map.class);
                
                if (mlResponse != null && mlResponse.containsKey("risk_score")) {
                    riskScore = (int) mlResponse.get("risk_score");
                    if (riskScore > 50 || (boolean) mlResponse.get("is_anomaly")) {
                        mfaRequired = true; // Risk-based MFA trigger
                    }
                }
            } catch (Exception e) {
                // fallback if ML service is down
                System.out.println("ML service unavailable: " + e.getMessage());
            }

            // Generate Token
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    request.getUsername(), null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
            String token = jwtTokenProvider.generateToken(auth);

            return ResponseEntity.ok(new AuthResponse(token, request.getUsername(), riskScore, mfaRequired));
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
