package com.talenthub.backend.controller;

import com.talenthub.backend.entity.*;
import com.talenthub.backend.payload.response.MessageResponse;
import com.talenthub.backend.repository.LeaveRequestRepository;
import com.talenthub.backend.repository.UserRepository;
import com.talenthub.backend.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
public class LeaveController {

    @Autowired
    LeaveRequestRepository leaveRequestRepository;

    @Autowired
    UserRepository userRepository;

    // 1. Submit leave request (Employee only)
    @PostMapping("/request")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> submitLeaveRequest(@Valid @RequestBody LeaveRequest leaveRequest) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        Employee employee = user.getEmployee();
        if (employee == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not linked to an Employee record."));
        }

        leaveRequest.setEmployee(employee);
        leaveRequest.setStatus(ELeaveStatus.PENDING);
        leaveRequestRepository.save(leaveRequest);

        return ResponseEntity.ok(new MessageResponse("Leave request submitted successfully!"));
    }

    // 2. View my leaves (Employee only)
    @GetMapping("/my-leaves")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<LeaveRequest> getMyLeaves() {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        Employee employee = user.getEmployee();
        return leaveRequestRepository.findByEmployee(employee);
    }

    // 3. View pending leaves (HR or ADMIN)
    @GetMapping("/pending")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public List<LeaveRequest> getPendingLeaves() {
        return leaveRequestRepository.findByStatus(ELeaveStatus.PENDING);
    }

    // 4. Approve leave request
    @PutMapping("/approve/{id}")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<?> approveLeave(@PathVariable Long id) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User manager = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: Manager user not found."));

        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Leave request not found."));

        leaveRequest.setStatus(ELeaveStatus.APPROVED);
        leaveRequest.setManager(manager); // Set the approver
        leaveRequestRepository.save(leaveRequest);

        return ResponseEntity.ok(new MessageResponse("Leave request approved successfully!"));
    }

    // 5. Reject leave request
    @PutMapping("/reject/{id}")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<?> rejectLeave(@PathVariable Long id) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User manager = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: Manager user not found."));

        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Leave request not found."));

        leaveRequest.setStatus(ELeaveStatus.REJECTED);
        leaveRequest.setManager(manager); // Set the denier
        leaveRequestRepository.save(leaveRequest);

        return ResponseEntity.ok(new MessageResponse("Leave request rejected."));
    }
}
