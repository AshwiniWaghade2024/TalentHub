package com.talenthub.backend.controller;

import com.talenthub.backend.entity.User;
import com.talenthub.backend.entity.Employee;
import com.talenthub.backend.payload.request.PasswordChangeRequest;
import com.talenthub.backend.payload.response.MessageResponse;
import com.talenthub.backend.repository.UserRepository;
import com.talenthub.backend.repository.EmployeeRepository;
import com.talenthub.backend.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    EmployeeRepository employeeRepository;

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

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        try {
            UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            Employee emp = user.getEmployee();
            if (emp == null) {
                // Create a new Employee record for HR/Admin if it doesn't exist
                emp = new Employee();
                String emailVal = user.getUsername();
                if (!emailVal.contains("@")) {
                    emailVal = emailVal + "@talenthub.com";
                }
                emp.setEmail(emailVal);
                emp.setRole(user.getRole());
                user.setEmployee(emp);
            }

            if (request.containsKey("firstName")) emp.setFirstName(request.get("firstName"));
            if (request.containsKey("lastName")) emp.setLastName(request.get("lastName"));
            
            // The frontend sends "username" instead of "email"
            if (request.containsKey("username")) {
                String newEmailOrUser = request.get("username").trim();
                if (newEmailOrUser.contains("@")) {
                    emp.setEmail(newEmailOrUser);
                }
            } else if (request.containsKey("email")) {
                emp.setEmail(request.get("email"));
            }

            // Fallback for Blank or invalid constraints
            if (emp.getEmail() == null || !emp.getEmail().contains("@")) {
                 emp.setEmail(user.getUsername() + "@talenthub.com");
            }
            if (emp.getFirstName() == null || emp.getFirstName().trim().isEmpty()) {
                 emp.setFirstName(user.getUsername());
            }
            if (emp.getLastName() == null || emp.getLastName().trim().isEmpty()) {
                 emp.setLastName("User");
            }

            employeeRepository.save(emp);
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating profile: " + e.getMessage()));
        }
    }
}
