package com.zerotrust.security.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
    private int hourOfDay; // mock parameter to send to ML service
    private int downloadCount;
    private int failedLogins;
}
