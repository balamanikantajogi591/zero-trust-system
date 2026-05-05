package com.zerotrust.security.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    // Return a mock list of users
    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        return List.of(
            Map.of("id", 1, "username", "admin", "email", "admin@zerotrust.local", "role", "ROLE_ADMIN", "status", "Active", "mfaEnabled", true),
            Map.of("id", 2, "username", "jdoe", "email", "jdoe@company.org", "role", "ROLE_ANALYST", "status", "Active", "mfaEnabled", true),
            Map.of("id", 3, "username", "bsmith", "email", "bsmith@example.com", "role", "ROLE_USER", "status", "Inactive", "mfaEnabled", false)
        );
    }

    @PostMapping
    public Map<String, Object> createUser(@RequestBody Map<String, Object> userData) {
        return Map.of("status", "success", "message", "User created", "data", userData);
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> userData) {
        return Map.of("status", "success", "message", "User " + id + " updated");
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteUser(@PathVariable Long id) {
        return Map.of("status", "success", "message", "User " + id + " deleted");
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
