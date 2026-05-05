package com.zerotrust.security.service;

import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DlpService {

    // Regex for basic patterns (Demo purposes)
    private static final String SSN_REGEX = "\\b\\d{3}-\\d{2}-\\d{4}\\b";
    private static final String EMAIL_REGEX = "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b";
    private static final String PHONE_REGEX = "\\b\\d{3}-\\d{3}-\\d{4}\\b";

    public String maskSensitiveData(String text) {
        if (text == null) return null;

        String masked = maskPattern(text, SSN_REGEX, "***-**-****");
        masked = maskPattern(masked, EMAIL_REGEX, "***@***.***");
        masked = maskPattern(masked, PHONE_REGEX, "***-***-****");

        return masked;
    }

    private String maskPattern(String text, String regex, String mask) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);
        return matcher.replaceAll(mask);
    }
}
