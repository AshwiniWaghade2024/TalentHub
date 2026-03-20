package com.talenthub.backend.controller;

import com.talenthub.backend.entity.User;
import com.talenthub.backend.payload.request.PasswordChangeRequest;
import com.talenthub.backend.payload.response.MessageResponse;
import com.talenthub.backend.repository.UserRepository;
import com.talenthub.backend.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Current password does not match."));
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setTemporaryPasswordFlag(false);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password updated successfully!"));
    }
}
