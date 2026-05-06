package com.zerotrust.service;

import org.springframework.stereotype.Service;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DlpService {

    private static final String EMAIL_PATTERN = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}";
    private static final String PHONE_PATTERN = "\\d{10}|\\+\\d{1,2}\\s\\d{10}";
    private static final String SSN_PATTERN = "\\d{3}-\\d{2}-\\d{4}";

    public String inspectAndMask(String data) {
        String maskedData = data;
        
        maskedData = maskPattern(maskedData, EMAIL_PATTERN, "email");
        maskedData = maskPattern(maskedData, PHONE_PATTERN, "phone");
        maskedData = maskPattern(maskedData, SSN_PATTERN, "id");
        
        return maskedData;
    }

    private String maskPattern(String text, String regex, String label) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);
        StringBuilder sb = new StringBuilder();
        int lastEnd = 0;
        
        while (matcher.find()) {
            sb.append(text, lastEnd, matcher.start());
            sb.append("[REDACTED-").append(label.toUpperCase()).append("]");
            lastEnd = matcher.end();
        }
        sb.append(text.substring(lastEnd));
        return sb.toString();
    }

    public boolean containsSensitiveData(String data) {
        return Pattern.compile(EMAIL_PATTERN).matcher(data).find() ||
               Pattern.compile(PHONE_PATTERN).matcher(data).find() ||
               Pattern.compile(SSN_PATTERN).matcher(data).find();
    }
}
