package com.talenthub.backend.config;

import com.talenthub.backend.entity.ERole;
import com.talenthub.backend.entity.Role;
import com.talenthub.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.talenthub.backend.entity.User;
import com.talenthub.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            roleRepository.save(new Role(ERole.ROLE_HR));
            roleRepository.save(new Role(ERole.ROLE_EMPLOYEE));
            System.out.println("Roles initialized: ROLE_ADMIN, ROLE_HR, ROLE_EMPLOYEE");
        }

        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", passwordEncoder.encode("admin123"));
            admin.setRole(roleRepository.findByName(ERole.ROLE_ADMIN).get());
            userRepository.save(admin);
            System.out.println("Default admin user created: admin / admin123");
        }
    }
}
