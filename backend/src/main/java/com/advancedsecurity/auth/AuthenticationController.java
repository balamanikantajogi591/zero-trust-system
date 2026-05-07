package com.advancedsecurity.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthenticationController {

    private final AuthenticationService service;

    /**
     * Admin-only login endpoint.
     * Rejects all accounts that do not have ADMIN role.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthenticationRequest request,
            jakarta.servlet.http.HttpServletRequest httpRequest
    ) {
        return service.login(request, httpRequest);
    }

    /**
     * Legacy authenticate kept for backward compatibility only.
     * Disabled for public access — all callers should use /admin-login.
     */
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            jakarta.servlet.http.HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(service.authenticate(request, httpRequest));
    }
}
