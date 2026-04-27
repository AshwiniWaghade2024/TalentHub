package com.talenthub.backend.controller;

import com.talenthub.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
public class ReportController {

    @Autowired
    private EmployeeRepository employeeRepository;

    // 1. Department Headcount Report
    @GetMapping("/headcount")
    public List<Object[]> headcount() {
        return employeeRepository.getDepartmentHeadcount();
    }

    // 2. Monthly Payroll Summary (Total Cost)
    @GetMapping("/payroll-total")
    public Map<String, Double> payrollTotal() {
        Double total = employeeRepository.getTotalMonthlyPayroll();
        Map<String, Double> response = new HashMap<>();
        response.put("totalMonthlyPayrollCost", total != null ? total : 0.0);
        return response;
    }
}
