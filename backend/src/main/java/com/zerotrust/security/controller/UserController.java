package com.zerotrust.security.controller;

import com.zerotrust.security.repository.UserRepository;
import com.zerotrust.security.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            String roles = user.getRoles().stream()
                    .map(r -> r.getName())
                    .collect(Collectors.joining(", "));
            
            return Map.of(
                "id", (Object)user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", roles,
                "status", "Active",
                "mfaEnabled", user.isMfaEnabled()
            );
        }).collect(Collectors.toList());
    }

    @GetMapping("/activity")
    public List<Map<String, Object>> getUserActivity() {
        return List.of(
            Map.of("time", "10:00 AM", "user", "admin", "action", "Logged in from IP 192.168.1.5"),
            Map.of("time", "10:15 AM", "user", "jdoe", "action", "Accessed restricted dashboard"),
            Map.of("time", "10:30 AM", "user", "system", "action", "Blocked brute force attempt")
        );
    }
}
