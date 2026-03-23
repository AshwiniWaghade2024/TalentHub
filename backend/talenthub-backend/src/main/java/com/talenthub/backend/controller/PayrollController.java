package com.talenthub.backend.controller;

import com.talenthub.backend.payload.request.CreateSalaryRequest;
import com.talenthub.backend.payload.response.MessageResponse;
import com.talenthub.backend.payload.response.PayslipCalculationResult;
import com.talenthub.backend.payload.response.PayslipResponse;
import com.talenthub.backend.payload.response.SalaryResponse;
import com.talenthub.backend.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.YearMonth;

/**
 * PayrollController - 10 REST API endpoints
 *
 * HR Operations (4):
 *   - POST /api/payroll/salary (create/update)
 *   - GET  /api/payroll/salary/{employeeId}
 *   - POST /api/payroll/calculate
 *   - GET  /api/payroll/payslips/{year}/{month}
 *
 * Employee Operations (4):
 *   - GET /api/payroll/my/salary
 *   - GET /api/payroll/my/payslips
 *   - GET /api/payroll/my/payslip/{payslipId}
 *   - GET /api/payroll/my/payslip/{payslipId}/download
 *
 * Admin/HR Operations (2):
 *   - GET /api/payroll/employee/{employeeId}/payslips
 *   - GET /api/payroll/employee/{employeeId}/payslip/{year}/{month}/download
 */
@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {
    private final PayrollService payrollService;

    // ==================== HR OPERATIONS ====================

    /**
     * HR: Create or update employee salary
     * POST /api/payroll/salary
     */
    @PostMapping("/salary")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> createOrUpdateSalary(@Valid @RequestBody CreateSalaryRequest request) {
        try {
            SalaryResponse salary = payrollService.createOrUpdateSalary(request);
            return ResponseEntity.ok(salary);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * HR: Get salary for a specific employee
     * GET /api/payroll/salary/{employeeId}
     */
    @GetMapping("/salary/{employeeId}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> getSalary(@PathVariable Long employeeId) {
        try {
            SalaryResponse salary = payrollService.getSalary(employeeId);
            return ResponseEntity.ok(salary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * HR: Calculate monthly payslip
     * POST /api/payroll/calculate?employeeId=1&year=2024&month=03
     */
    @PostMapping("/calculate")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> calculatePayslip(
            @RequestParam Long employeeId,
            @RequestParam Integer year,
            @RequestParam Integer month) {
        try {
            if (month < 1 || month > 12) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Month must be between 1 and 12"));
            }
            if (year < 2000) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid year"));
            }
            PayslipCalculationResult result = payrollService.calculatePayslip(employeeId, year, month);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * HR: Get all payslips for a specific month (paginated)
     * GET /api/payroll/payslips/{year}/{month}?page=0&size=20
     */
    @GetMapping("/payslips/{year}/{month}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> getPayslipsByMonth(
            @PathVariable Integer year,
            @PathVariable Integer month,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            if (month < 1 || month > 12) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Month must be between 1 and 12"));
            }
            if (size > 100) size = 100; // Max 100 per page
            Pageable pageable = PageRequest.of(page, size);
            Page<PayslipResponse> payslips = payrollService.getPayslipsByMonth(year, month, pageable);
            return ResponseEntity.ok(payslips);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // ==================== EMPLOYEE OPERATIONS ====================

    /**
     * Employee: View own salary information
     * GET /api/payroll/my/salary
     */
    @GetMapping("/my/salary")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> getOwnSalary() {
        try {
            Long employeeId = payrollService.getCurrentEmployee().getId();
            SalaryResponse salary = payrollService.getSalary(employeeId);
            return ResponseEntity.ok(salary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Employee: View own payslips history (paginated)
     * GET /api/payroll/my/payslips?page=0&size=20
     */
    @GetMapping("/my/payslips")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> getOwnPayslips(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Long employeeId = payrollService.getCurrentEmployee().getId();
            if (size > 100) size = 100;
            Pageable pageable = PageRequest.of(page, size);
            Page<PayslipResponse> payslips = payrollService.getEmployeePayslips(employeeId, pageable);
            return ResponseEntity.ok(payslips);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Employee: View single payslip details
     * GET /api/payroll/my/payslip/{payslipId}
     */
    @GetMapping("/my/payslip/{payslipId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> getPayslipDetails(@PathVariable Long payslipId) {
        try {
            Long employeeId = payrollService.getCurrentEmployee().getId();
            if (!payrollService.canAccessPayslip(payslipId, employeeId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Error: You don't have access to this payslip"));
            }
            PayslipResponse payslip = payrollService.getPayslip(payslipId);
            return ResponseEntity.ok(payslip);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Employee: Download own payslip as PDF
     * GET /api/payroll/my/payslip/{payslipId}/download
     */
    @GetMapping("/my/payslip/{payslipId}/download")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> downloadPayslipPdf(@PathVariable Long payslipId) {
        try {
            Long employeeId = payrollService.getCurrentEmployee().getId();
            if (!payrollService.canAccessPayslip(payslipId, employeeId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Error: You don't have access to this payslip"));
            }

            byte[] pdfBytes = payrollService.downloadPayslipPdf(payslipId);
            String filename = "payslip_" + payslipId + ".pdf";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.attachment()
                                    .filename(filename)
                                    .build()
                                    .toString())
                    .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // ==================== ADMIN/HR OPERATIONS ====================

    /**
     * HR: Get all payslips for a specific employee (paginated)
     * GET /api/payroll/employee/{employeeId}/payslips?page=0&size=20
     */
    @GetMapping("/employee/{employeeId}/payslips")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> getEmployeePayslips(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            if (size > 100) size = 100;
            Pageable pageable = PageRequest.of(page, size);
            Page<PayslipResponse> payslips = payrollService.getEmployeePayslips(employeeId, pageable);
            return ResponseEntity.ok(payslips);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * HR: Download specific employee's payslip for a month as PDF
     * GET /api/payroll/employee/{employeeId}/payslip/{year}/{month}/download
     */
    @GetMapping("/employee/{employeeId}/payslip/{year}/{month}/download")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> downloadEmployeePayslipPdf(
            @PathVariable Long employeeId,
            @PathVariable Integer year,
            @PathVariable Integer month) {
        try {
            if (month < 1 || month > 12) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Month must be between 1 and 12"));
            }

            // Get payslip by employee, year, month
            PayslipResponse payslip = payrollService.getPayslipsByMonth(year, month, PageRequest.of(0, 1))
                    .stream()
                    .filter(p -> p.getEmployeeId().equals(employeeId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            "Payslip not found for employee " + employeeId + " for " + year + "-" + month));

            byte[] pdfBytes = payrollService.downloadPayslipPdf(payslip.getId());
            String filename = "payslip_" + employeeId + "_" + year + "_" + month + ".pdf";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.attachment()
                                    .filename(filename)
                                    .build()
                                    .toString())
                    .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
