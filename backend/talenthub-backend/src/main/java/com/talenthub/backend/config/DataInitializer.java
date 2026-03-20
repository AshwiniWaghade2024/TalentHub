package com.talenthub.backend.config;

import com.talenthub.backend.entity.ERole;
import com.talenthub.backend.entity.Role;
import com.talenthub.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            roleRepository.save(new Role(ERole.ROLE_HR));
            roleRepository.save(new Role(ERole.ROLE_EMPLOYEE));
            System.out.println("Roles initialized: ROLE_ADMIN, ROLE_HR, ROLE_EMPLOYEE");
        }
    }
}
