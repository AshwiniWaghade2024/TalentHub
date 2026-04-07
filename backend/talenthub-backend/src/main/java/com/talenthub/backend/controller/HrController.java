package com.talenthub.backend.controller;

import com.talenthub.backend.entity.*;
import com.talenthub.backend.repository.*;
import com.talenthub.backend.payload.response.MessageResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/hr")
public class HrController {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @PostMapping("/create-employee")
    @PreAuthorize("hasRole('HR')")
    @Transactional
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee, @RequestParam(required = false) String tempPassword) {

        String email = employee.getEmail() != null ? employee.getEmail().trim().toLowerCase() : null;
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required!"));
        }

        if (userRepository.existsByUsername(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email already in use!"));
        }

        Role role = roleRepository.findByName(ERole.ROLE_EMPLOYEE)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // Get currently logged-in HR user
        String hrUsername = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User hrUser = userRepository.findByUsername(hrUsername)
                .orElseThrow(() -> new RuntimeException("HR User not found"));

        employee.setEmail(email);
        employee.setRole(role); // Set role on employee for stats
        employee.setCreatedBy(hrUser); // Set who created this employee
        employeeRepository.save(employee);

        // Use provided password or generate one
        String finalPassword = (tempPassword == null || tempPassword.isBlank()) 
                                ? "EMP" + String.format("%04d", new Random().nextInt(10000)) 
                                : tempPassword;

        User user = new User();
        user.setUsername(email);
        user.setPassword(encoder.encode(finalPassword));
        user.setEmployee(employee);
        user.setRole(role);
        user.setTemporaryPasswordFlag(true);

        userRepository.save(user);

        return ResponseEntity.ok(
                new MessageResponse("Employee created successfully. Password: " + finalPassword)
        );
    }

    // RESET EMPLOYEE PASSWORD
    @PostMapping("/employee/{id}/reset-password")
    @PreAuthorize("hasRole('HR')")
    @Transactional
    public ResponseEntity<?> resetEmployeePassword(@PathVariable Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Employee not found."));
        
        User user = userRepository.findByEmployee(emp)
                .orElseThrow(() -> new RuntimeException("Error: User account not found for this employee."));

        String newPassword = "EMP" + String.format("%04d", new Random().nextInt(10000));
        user.setPassword(encoder.encode(newPassword));
        user.setTemporaryPasswordFlag(true);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password reset successful. New Password: " + newPassword));
    }

    //VIEW ALL EMPLOYEES
    @GetMapping("/employees")
    @PreAuthorize("hasRole('HR')")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .filter(e -> e.getRole() == null || e.getRole().getName() == ERole.ROLE_EMPLOYEE)
                .collect(java.util.stream.Collectors.toList());
    }

    @Autowired
    DepartmentRepository departmentRepository;

    //UPDATE EMPLOYEE
    @PutMapping("/employee/{id}")
    @PreAuthorize("hasRole('HR')")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee updated) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        if (updated.getFirstName() != null) emp.setFirstName(updated.getFirstName());
        if (updated.getLastName() != null) emp.setLastName(updated.getLastName());
        if (updated.getEmail() != null) emp.setEmail(updated.getEmail());

        // Also update department if provided
        if (updated.getDepartment() != null && updated.getDepartment().getId() != null) {
            Department dept = departmentRepository.findById(updated.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            emp.setDepartment(dept);
        }

        // Also update salary if provided
        if (updated.getBasicSalary() != null) {
            emp.setBasicSalary(updated.getBasicSalary());
        }

        return employeeRepository.save(emp);
    }

    //DELETE EMPLOYEE
    @DeleteMapping("/employee/{id}")
    @PreAuthorize("hasRole('HR')")
    @Transactional
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Employee not found."));

        // Delete associated User account
        userRepository.findByEmployee(emp).ifPresent(u -> userRepository.delete(u));

        employeeRepository.delete(emp);
        return ResponseEntity.ok(new MessageResponse("Employee deleted"));
    }
}