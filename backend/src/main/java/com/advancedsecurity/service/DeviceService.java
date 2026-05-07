package com.advancedsecurity.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class DeviceService {

    public String getDeviceFingerprint(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        String acceptLanguage = request.getHeader("Accept-Language");
        String remoteAddr = request.getRemoteAddr();
        
        // Simple fingerprinting by combining headers and IP
        String rawFingerprint = userAgent + "|" + acceptLanguage + "|" + remoteAddr;
        return Base64.getEncoder().encodeToString(rawFingerprint.getBytes());
    }

    public boolean isNewDevice(String fingerprint, String savedFingerprint) {
        return savedFingerprint == null || !savedFingerprint.equals(fingerprint);
    }
}
