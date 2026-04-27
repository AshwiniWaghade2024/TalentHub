package com.talenthub.backend.controller;

import com.talenthub.backend.entity.Employee;
import com.talenthub.backend.entity.Salary;
import com.talenthub.backend.entity.User;
// import com.talenthub.backend.payload.response.MessageResponse;
import com.talenthub.backend.repository.EmployeeRepository;
import com.talenthub.backend.repository.SalaryRepository;
import com.talenthub.backend.repository.UserRepository;
import com.talenthub.backend.security.services.UserDetailsImpl;
import com.talenthub.backend.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SalaryRepository salaryRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. HR calculates salary for an employee
    @PostMapping("/calculate/{employeeId}")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<?> calculateMonthlySalary(@PathVariable Long employeeId, @RequestParam int month,
            @RequestParam int year) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Error: Employee not found."));

        // Security check: HR cannot process their own payroll
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: Current user not found."));

        if (currentUser.getEmployee() != null && currentUser.getEmployee().getId().equals(employeeId)) {
             return ResponseEntity.badRequest().body("Error: You cannot run your own payroll.");
        }

        Salary salary = payrollService.calculateSalary(employee, month, year);
        return ResponseEntity.ok(salary);
    }

    // 2. Download Payslip PDF
    @GetMapping(value = "/download-payslip/{salaryId}", produces = MediaType.APPLICATION_PDF_VALUE)
    @PreAuthorize("isAuthenticated()") // Any authenticated user can download their own slip
    public ResponseEntity<InputStreamResource> downloadPayslip(@PathVariable Long salaryId) {

        Salary salary = salaryRepository.findById(salaryId)
                .orElseThrow(() -> new RuntimeException("Error: Salary record not found."));

        // Check if the current user is authorized to see this slip
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        User currentUser = userRepository.findById(userPrincipal.getId()).get();

        // Allowed if HR/ADMIN or the Employee owning the slip
        boolean isOwner = currentUser.getEmployee() != null
                && currentUser.getEmployee().getId().equals(salary.getEmployee().getId());
        boolean isHR = currentUser.getRole().getName().name().contains("HR")
                || currentUser.getRole().getName().name().contains("ADMIN");

        if (!isOwner && !isHR) {
            return ResponseEntity.status(403).build();
        }

        ByteArrayInputStream bis = payrollService.generatePayslipPdf(salary);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition",
                "inline; filename=payslip_" + salary.getEmployee().getFirstName() + "_" + salary.getMonth() + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    // 3. View my salary history (Employee)
    @GetMapping("/my-history")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<Salary> getMyHistory() {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        User user = userRepository.findById(userPrincipal.getId()).get();
        return salaryRepository.findByEmployee(user.getEmployee());
    }

    // 4. View all salary history (HR or Admin)
    @GetMapping("/all-history")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public List<Salary> getAllHistory() {
        return salaryRepository.findAll();
    }
}
