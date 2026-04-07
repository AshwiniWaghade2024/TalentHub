package com.talenthub.backend.controller;

import com.talenthub.backend.payload.request.LoginRequest;
import com.talenthub.backend.payload.response.JwtResponse;
import com.talenthub.backend.security.jwt.JwtUtils;
import com.talenthub.backend.security.services.UserDetailsImpl;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import com.talenthub.backend.entity.User;
import com.talenthub.backend.repository.UserRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        String jwt = jwtUtils.generateJwtToken(authentication);

        // Fetch User entity to check the flag
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found"));

        String firstName = "";
        String lastName = "";
        if (user.getEmployee() != null) {
            firstName = user.getEmployee().getFirstName();
            lastName = user.getEmployee().getLastName();
        }

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), roles, user.isTemporaryPasswordFlag(), firstName, lastName));
    }
}