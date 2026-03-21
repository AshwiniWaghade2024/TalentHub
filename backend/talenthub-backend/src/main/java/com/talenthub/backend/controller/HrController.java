package com.talenthub.backend.controller;

import com.talenthub.backend.entity.*;
import com.talenthub.backend.repository.*;
import com.talenthub.backend.payload.response.MessageResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    //CREATE EMPLOYEE
    @PostMapping("/create-employee")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {

        employeeRepository.save(employee);

        String tempPassword = "EMP" + new Random().nextInt(9999);

        Role role = roleRepository.findByName(ERole.ROLE_EMPLOYEE)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setUsername(employee.getEmail());
        user.setPassword(encoder.encode(tempPassword));
        user.setEmployee(employee);
        user.setRole(role);
        user.setTemporaryPasswordFlag(true);

        userRepository.save(user);

        return ResponseEntity.ok(
                new MessageResponse("Employee created. Temp Password: " + tempPassword)
        );
    }

    //VIEW ALL EMPLOYEES
    @GetMapping("/employees")
    @PreAuthorize("hasRole('HR')")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    //UPDATE EMPLOYEE
    @PutMapping("/employee/{id}")
    @PreAuthorize("hasRole('HR')")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee updated) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        emp.setFirstName(updated.getFirstName());
        emp.setLastName(updated.getLastName());
        emp.setEmail(updated.getEmail());

        return employeeRepository.save(emp);
    }

    //DELETE EMPLOYEE
    @DeleteMapping("/employee/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        employeeRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Employee deleted"));
    }
}