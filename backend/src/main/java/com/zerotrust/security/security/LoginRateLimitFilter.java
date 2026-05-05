package com.zerotrust.security.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private final ConcurrentHashMap<String, RateLimitRecord> requestCountsPerIpAddress = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS_PER_MINUTE = 5;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getRequestURI().equals("/api/auth/login") && request.getMethod().equalsIgnoreCase("POST")) {
            String clientIpAddress = getClientIP(request);
            
            RateLimitRecord record = requestCountsPerIpAddress.compute(clientIpAddress, (key, val) -> {
                long now = System.currentTimeMillis();
                if (val == null || now - val.timestamp > 60000) {
                    return new RateLimitRecord(1, now);
                } else {
                    val.count++;
                    return val;
                }
            });

            if (record.count > MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many login attempts. Please try again later.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private static class RateLimitRecord {
        int count;
        long timestamp;

        RateLimitRecord(int count, long timestamp) {
            this.count = count;
            this.timestamp = timestamp;
        }
    }
}
