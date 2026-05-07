package com.advancedsecurity.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MfaService {

    private final StringRedisTemplate redisTemplate;
    private final NotificationService notificationService;

    private static final String OTP_PREFIX = "mfa:otp:";
    private static final int OTP_EXPIRY_MINUTES = 5;

    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Save to Redis with expiry
        redisTemplate.opsForValue().set(OTP_PREFIX + email, otp, OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);
        
        // In a real system, we would send an email here.
        // For this demo, we'll send it via WebSocket/Notification to the admin/user
        notificationService.sendAlert("MFA Required", "Your OTP is: " + otp, "INFO");
        System.out.println("DEBUG: OTP for " + email + " is " + otp);
    }

    public boolean verifyOtp(String email, String otp) {
        String savedOtp = redisTemplate.opsForValue().get(OTP_PREFIX + email);
        if (savedOtp != null && savedOtp.equals(otp)) {
            redisTemplate.delete(OTP_PREFIX + email);
            return true;
        }
        return false;
    }
}
