package com.talenthub.backend.controller;

import com.talenthub.backend.entity.*;
import com.talenthub.backend.payload.response.MessageResponse;
import com.talenthub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    //ADMIN CREATES HR
    @PostMapping("/create-hr")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createHR(@RequestParam String username) {

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Username already exists"));
        }

        //Generate temporary password
        String tempPassword = generateTempPassword();

        Role role = roleRepository.findByName(ERole.ROLE_HR)
                .orElseThrow(() -> new RuntimeException("Error: Role not found"));

        User user = new User();
        user.setUsername(username);
        user.setPassword(encoder.encode(tempPassword));
        user.setRole(role);
        user.setTemporaryPasswordFlag(true);

        userRepository.save(user);

        return ResponseEntity.ok(
                new MessageResponse("HR created. Temp Password: " + tempPassword)
        );
    }

    private String generateTempPassword() {
        return "HR" + new Random().nextInt(9999);
    }
}