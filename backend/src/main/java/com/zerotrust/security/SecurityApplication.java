package com.zerotrust.security;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.zerotrust.security.repository.UserRepository;
import com.zerotrust.security.repository.RoleRepository;
import com.zerotrust.security.model.Role;
import java.util.List;
import java.util.Set;
import java.util.Collections;

@SpringBootApplication
@EnableCaching
public class SecurityApplication {

	public static void main(String[] args) {
		SpringApplication.run(SecurityApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(UserRepository userRepository, RoleRepository roleRepository) {
		return args -> {
			// Pre-populate roles
			if (roleRepository.findByName("ROLE_USER").isEmpty()) roleRepository.save(new Role(null, "ROLE_USER"));
			if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) roleRepository.save(new Role(null, "ROLE_ADMIN"));
			if (roleRepository.findByName("ROLE_ANALYST").isEmpty()) roleRepository.save(new Role(null, "ROLE_ANALYST"));

			Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();
			
			// Enforce Single Admin policy
			List<User> users = userRepository.findAll();
			for (User user : users) {
				boolean isAdmin = user.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));
				if (isAdmin && !"balamanikantajogi591@gmail.com".equalsIgnoreCase(user.getEmail())) {
					System.out.println("Enforcing Security: Downgrading unauthorized admin: " + user.getEmail());
					user.setRoles(Collections.singleton(userRole));
					userRepository.save(user);
				}
			}
		};
	}
}
