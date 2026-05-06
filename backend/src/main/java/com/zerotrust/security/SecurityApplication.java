package com.zerotrust.security;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.zerotrust.security.repository.UserRepository;
import com.zerotrust.security.model.User;
import java.util.List;

@SpringBootApplication
@EnableCaching
public class SecurityApplication {

	public static void main(String[] args) {
		SpringApplication.run(SecurityApplication.class, args);
	}

	@Bean
	public CommandLineRunner enforceSingleAdmin(UserRepository userRepository) {
		return args -> {
			List<User> admins = userRepository.findAll().stream()
				.filter(u -> "ROLE_ADMIN".equals(u.getRole()))
				.toList();
			
			for (User admin : admins) {
				if (!"balamanikantajogi591@gmail.com".equalsIgnoreCase(admin.getEmail())) {
					System.out.println("Enforcing Security: Downgrading unauthorized admin: " + admin.getEmail());
					admin.setRole("ROLE_USER");
					userRepository.save(admin);
				}
			}
		};
	}
}
