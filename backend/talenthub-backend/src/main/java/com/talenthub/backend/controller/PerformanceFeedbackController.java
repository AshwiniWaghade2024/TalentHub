package com.talenthub.backend.controller;

import com.talenthub.backend.entity.Employee;
import com.talenthub.backend.entity.PerformanceFeedback;
import com.talenthub.backend.entity.User;
import com.talenthub.backend.payload.response.MessageResponse;
import com.talenthub.backend.repository.EmployeeRepository;
import com.talenthub.backend.repository.UserRepository;
import com.talenthub.backend.security.services.UserDetailsImpl;
import com.talenthub.backend.service.PerformanceFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class PerformanceFeedbackController {

    @Autowired
    private PerformanceFeedbackService service;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Submit Feedback (HR or ADMIN only)
    @PostMapping("/submit/{employeeId}")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<?> submitFeedback(@PathVariable Long employeeId, @RequestBody String feedbackText) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Error: Employee not found."));

        PerformanceFeedback feedback = new PerformanceFeedback();
        feedback.setEmployee(employee);
        feedback.setSubmittedByUserId(userPrincipal.getId());
        feedback.setFeedbackText(feedbackText);
        feedback.setFeedbackDate(LocalDate.now());

        service.submitFeedback(feedback);
        return ResponseEntity.ok(new MessageResponse("Performance feedback submitted successfuly."));
    }

    // 2. View My Feedback (Employee only)
    @GetMapping("/my-feedback")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<PerformanceFeedback> getMyFeedback() {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        
        Employee employee = user.getEmployee();
        return service.getEmployeeFeedback(employee);
    }
}
