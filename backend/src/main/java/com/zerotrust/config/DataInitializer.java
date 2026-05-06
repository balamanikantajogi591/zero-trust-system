package com.zerotrust.config;

import com.zerotrust.model.Role;
import com.zerotrust.model.User;
import com.zerotrust.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
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
                System.out.println("ADMIN USER CREATED: " + adminEmail);
            }
        };
    }
}
