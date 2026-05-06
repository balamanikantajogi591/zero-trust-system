package com.zerotrust.config;

import com.zerotrust.model.Role;
import com.zerotrust.model.User;
import com.zerotrust.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "balamanikantajogi591@gmail.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .firstname("Mani")
                    .lastname("047")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Mani047@"))
                    .role(Role.ADMIN)
                    .mfaEnabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("CRITICAL: ADMIN USER CREATED -> " + adminEmail);
        }
    }
}
