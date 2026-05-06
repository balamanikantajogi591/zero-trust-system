package com.zerotrust.security.controller;

import com.zerotrust.security.model.Role;
import com.zerotrust.security.model.User;
import com.zerotrust.security.repository.RoleRepository;
import com.zerotrust.security.repository.UserRepository;
import com.zerotrust.security.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.Collections;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AuditService auditService;

    @PutMapping("/assign-role")
    public ResponseEntity<?> assignRole(@RequestBody Map<String, String> request, Authentication authentication) {
        String email = request.get("email");
        String roleName = request.get("role"); // e.g., ROLE_ADMIN, ROLE_ANALYST, ROLE_USER

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Optional<Role> roleOpt = roleRepository.findByName(roleName);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Role not found");
        }

        User user = userOpt.get();
        Role role = roleOpt.get();

        // Security check: Only allow specific roles or perform logic
        user.getRoles().add(role);
        userRepository.save(user);

        // Audit Logging
        String adminUsername = authentication.getName();
        auditService.logAction(adminUsername, "ASSIGN_ROLE", 
            "Assigned role " + roleName + " to user " + email);

        return ResponseEntity.ok("Role assigned successfully");
    }

    @DeleteMapping("/remove-role")
    public ResponseEntity<?> removeRole(@RequestBody Map<String, String> request, Authentication authentication) {
        String email = request.get("email");
        String roleName = request.get("role");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        user.getRoles().removeIf(r -> r.getName().equals(roleName));
        userRepository.save(user);

        // Audit Logging
        String adminUsername = authentication.getName();
        auditService.logAction(adminUsername, "REMOVE_ROLE", 
            "Removed role " + roleName + " from user " + email);

        return ResponseEntity.ok("Role removed successfully");
    }
}
