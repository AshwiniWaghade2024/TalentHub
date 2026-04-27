package com.talenthub.backend.controller;

import com.talenthub.backend.entity.*;
import com.talenthub.backend.payload.response.MessageResponse;
import com.talenthub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;
import java.util.List;

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
    @Transactional
    public ResponseEntity<?> createHR(@RequestParam String username, @RequestParam(required = false) String tempPassword) {

        String cleanedUsername = username != null ? username.trim().toLowerCase() : null;
        if (cleanedUsername == null || cleanedUsername.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username/Email is required!"));
        }

        if (userRepository.existsByUsername(cleanedUsername)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username/Email already exists"));
        }

        // Use provided password or generate one
        String finalPassword = (tempPassword == null || tempPassword.isBlank()) 
                                ? generateTempPassword() 
                                : tempPassword;

        Role role = roleRepository.findByName(ERole.ROLE_HR)
                .orElseThrow(() -> new RuntimeException("Error: Role not found"));

        User user = new User();
        user.setUsername(cleanedUsername);
        user.setPassword(encoder.encode(finalPassword));
        user.setRole(role);
        user.setTemporaryPasswordFlag(true);

        userRepository.save(user);

        return ResponseEntity.ok(
                new MessageResponse("HR created successfully. Password: " + finalPassword)
        );
    }

    @GetMapping("/hr-list")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllHR() {
        Role role = roleRepository.findByName(ERole.ROLE_HR)
                .orElseThrow(() -> new RuntimeException("Error: Role not found"));
        return userRepository.findByRole(role);
    }

    @DeleteMapping("/delete-hr/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteHR(@PathVariable Long id) {
        User hrUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: HR User not found"));
        
        // Detach employees created by this HR using direct update to avoid proxy issues
        employeeRepository.detachEmployeesByCreatorId(id);

        // Detach leave requests handled by this HR
        leaveRequestRepository.detachLeavesByManagerId(id);

        userRepository.delete(hrUser);
        return ResponseEntity.ok(new MessageResponse("HR user deleted successfully!"));
    }

    @Autowired
    EmployeeRepository employeeRepository;

    @GetMapping("/hr/{id}/employees")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Employee> getHREmployees(@PathVariable Long id) {
        User hrUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: HR User not found"));
        return employeeRepository.findByCreatedBy_Id(hrUser.getId());
    }

    @GetMapping("/debug-employees")
    @PreAuthorize("hasRole('ADMIN')")
    public void debugEmployees() {
        List<Employee> all = employeeRepository.findAll();
        System.out.println("DEBUG ALL EMPLOYEES: " + all.size());
        for (Employee e : all) {
            System.out.println("Employee: " + e.getFirstName() + ", Email: " + e.getEmail() + ", CreatedBy: " + (e.getCreatedBy() != null ? e.getCreatedBy().getUsername() : "NULL"));
        }
    }

    @Autowired
    LeaveRequestRepository leaveRequestRepository;

    @Autowired
    PayslipRepository payslipRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> getGeneralStats() {
        long totalEmployees = employeeRepository.findAll().stream()
                .filter(e -> e.getRole() == null || e.getRole().getName() == ERole.ROLE_EMPLOYEE)
                .count();
        
        Role hrRole = roleRepository.findByName(ERole.ROLE_HR)
                .orElseThrow(() -> new RuntimeException("Error: Role not found"));
        long totalHR = userRepository.countByRole(hrRole);

        long pendingLeaves = leaveRequestRepository.countByStatus(ELeaveStatus.PENDING);

        java.time.LocalDate now = java.time.LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();
        
        java.math.BigDecimal totalPayroll = payslipRepository.sumNetSalaryByYearAndMonth(currentYear, currentMonth);
        if (totalPayroll == null) totalPayroll = java.math.BigDecimal.ZERO;

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalEmployees", totalEmployees);
        stats.put("totalHR", totalHR);
        stats.put("pendingLeaves", pendingLeaves);
        stats.put("totalPayroll", totalPayroll);

        return ResponseEntity.ok(stats);
    }

    private String generateTempPassword() {
        return "HR" + String.format("%04d", new Random().nextInt(10000));
    }
}