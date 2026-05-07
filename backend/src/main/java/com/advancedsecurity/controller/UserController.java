package com.advancedsecurity.controller;

import com.advancedsecurity.model.User;
import com.advancedsecurity.model.Role;
import com.advancedsecurity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        User user = User.builder()
                .firstname(request.getOrDefault("firstname", "New"))
                .lastname(request.getOrDefault("lastname", "User"))
                .email(email)
                .password(passwordEncoder.encode(request.getOrDefault("password", "Welcome@123")))
                .role(Role.valueOf(request.getOrDefault("role", "USER")))
                .status("Active")
                .riskScore(10)
                .mfaEnabled(false)
                .build();
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> request) {
        String roleStr = request.get("role");
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(Role.valueOf(roleStr));
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
