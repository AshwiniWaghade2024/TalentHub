package com.talenthub.backend.controller;

import com.talenthub.backend.entity.Attendance;
import com.talenthub.backend.entity.Employee;
import com.talenthub.backend.entity.User;
import com.talenthub.backend.payload.response.MessageResponse;
import com.talenthub.backend.repository.AttendanceRepository;
import com.talenthub.backend.repository.UserRepository;
import com.talenthub.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    AttendanceRepository attendanceRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn() {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        Employee employee = user.getEmployee();
        if (employee == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User is not linked to an Employee record."));
        }

        LocalDate today = LocalDate.now();
        if (attendanceRepository.findByEmployeeAndDate(employee, today).isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Already checked in today."));
        }

        Attendance attendance = new Attendance(employee, today, LocalTime.now());
        attendanceRepository.save(attendance);

        return ResponseEntity.ok(new MessageResponse("Check-in successful at " + attendance.getCheckInTime()));
    }

    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut() {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        Employee employee = user.getEmployee();
        if (employee == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User is not linked to an Employee record."));
        }

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeAndDate(employee, today)
                .orElseThrow(() -> new RuntimeException("Error: No check-in found for today."));

        if (attendance.getCheckOutTime() != null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Already checked out today."));
        }

        attendance.setCheckOutTime(LocalTime.now());
        attendanceRepository.save(attendance);

        return ResponseEntity.ok(new MessageResponse("Check-out successful at " + attendance.getCheckOutTime()));
    }

    @GetMapping("/my-history")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('HR') or hasRole('ADMIN')")
    public List<Attendance> getMyHistory() {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        Employee employee = user.getEmployee();
        if (employee == null) return Collections.emptyList();

        return attendanceRepository.findByEmployeeOrderByDateDesc(employee);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
}
