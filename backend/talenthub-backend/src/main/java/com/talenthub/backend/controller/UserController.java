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
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        Employee emp = user.getEmployee();
        if (emp == null) {
            // Create a new Employee record for HR/Admin if it doesn't exist
            emp = new Employee();
            emp.setEmail(user.getUsername());
            emp.setRole(user.getRole());
            user.setEmployee(emp);
        }

        if (request.containsKey("firstName")) emp.setFirstName(request.get("firstName"));
        if (request.containsKey("lastName")) emp.setLastName(request.get("lastName"));
        if (request.containsKey("email")) emp.setEmail(request.get("email"));
        
        employeeRepository.save(emp);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
    }
}
