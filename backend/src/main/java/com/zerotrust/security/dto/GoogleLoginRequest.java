package com.zerotrust.security.dto;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String token; // The simulated or real Google ID token
    private String email; // Simulated email from the frontend mock
    private String name;  // Simulated name from the frontend mock
    private int hourOfDay;
    private int downloadCount;
    private int failedLogins;
}
