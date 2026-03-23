package com.talenthub.backend.service;

import com.talenthub.backend.entity.Employee;
import com.talenthub.backend.entity.Payslip;
import com.talenthub.backend.entity.Salary;
import com.talenthub.backend.payload.request.CreateSalaryRequest;
import com.talenthub.backend.payload.response.PayslipCalculationResult;
import com.talenthub.backend.payload.response.PayslipResponse;
import com.talenthub.backend.payload.response.SalaryResponse;
import com.talenthub.backend.repository.EmployeeRepository;
import com.talenthub.backend.repository.PayslipRepository;
import com.talenthub.backend.repository.SalaryRepository;
import com.talenthub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Main Payroll Service - Consolidated orchestration
 * Handles salary management, payslip generation, and user context
 * Combines logic that would otherwise require separate service classes
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PayrollService {
    private final SalaryRepository salaryRepository;
    private final PayslipRepository payslipRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PayslipCalculationService calculationService;
    private final PayslipPdfGeneratorService pdfGeneratorService;

    // ==================== SALARY MANAGEMENT ====================

    /**
     * Create or update salary for an employee
     */
    public SalaryResponse createOrUpdateSalary(CreateSalaryRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + request.getEmployeeId()));

        Salary salary = salaryRepository.findByEmployeeId(request.getEmployeeId())
                .orElse(new Salary());

        salary.setEmployee(employee);
        salary.setBaseSalary(request.getBaseSalary());
        salary.setPfPercentage(request.getPfPercentage());
        salary.setEsiPercentage(request.getEsiPercentage());
        salary.setEffectiveFrom(LocalDateTime.now());

        salary = salaryRepository.save(salary);
        return mapToSalaryResponse(salary);
    }

    /**
     * Get salary for an employee
     */
    public SalaryResponse getSalary(Long employeeId) {
        Salary salary = salaryRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Salary not found for employee ID: " + employeeId));
        return mapToSalaryResponse(salary);
    }

    // ==================== PAYSLIP MANAGEMENT ====================

    /**
     * Calculate and generate payslip for a given month
     * Idempotent: returns existing payslip if already generated
     */
    public PayslipCalculationResult calculatePayslip(Long employeeId, Integer year, Integer month) {
        Salary salary = salaryRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Salary not found for employee ID: " + employeeId));

        // Check if payslip already exists (idempotent)
        Payslip existingPayslip = payslipRepository
                .findByEmployeeIdAndYearAndMonth(employeeId, year, month)
                .orElse(null);

        if (existingPayslip != null) {
            return mapToCalculationResult(existingPayslip);
        }

        // Calculate deductions
        BigDecimal pfDeduction = calculationService.calculatePFDeduction(
                salary.getBaseSalary(), salary.getPfPercentage());
        BigDecimal esiDeduction = calculationService.calculateESIDeduction(
                salary.getBaseSalary(), salary.getEsiPercentage());
        BigDecimal totalDeductions = calculationService.calculateTotalDeductions(pfDeduction, esiDeduction);
        BigDecimal netSalary = calculationService.calculateNetSalary(salary.getBaseSalary(), totalDeductions);

        // Create and save payslip
        Payslip payslip = new Payslip();
        payslip.setEmployee(salary.getEmployee());
        payslip.setYear(year);
        payslip.setMonth(month);
        payslip.setBaseSalary(salary.getBaseSalary());
        payslip.setPfDeduction(pfDeduction);
        payslip.setEsiDeduction(esiDeduction);
        payslip.setTotalDeductions(totalDeductions);
        payslip.setNetSalary(netSalary);

        payslip = payslipRepository.save(payslip);
        return mapToCalculationResult(payslip);
    }

    /**
     * Get payslip by ID
     */
    public PayslipResponse getPayslip(Long payslipId) {
        Payslip payslip = payslipRepository.findById(payslipId)
                .orElseThrow(() -> new RuntimeException("Payslip not found with ID: " + payslipId));
        return mapToPayslipResponse(payslip);
    }

    /**
     * Get all payslips for an employee (paginated)
     */
    public Page<PayslipResponse> getEmployeePayslips(Long employeeId, Pageable pageable) {
        return payslipRepository.findByEmployeeIdOrderByYearDescMonthDesc(employeeId, pageable)
                .map(this::mapToPayslipResponse);
    }

    /**
     * Get all payslips for a specific month (paginated)
     */
    public Page<PayslipResponse> getPayslipsByMonth(Integer year, Integer month, Pageable pageable) {
        return payslipRepository.findByYearAndMonthOrderByEmployeeId(year, month, pageable)
                .map(this::mapToPayslipResponse);
    }

    /**
     * Download payslip as PDF
     */
    public byte[] downloadPayslipPdf(Long payslipId) {
        Payslip payslip = payslipRepository.findById(payslipId)
                .orElseThrow(() -> new RuntimeException("Payslip not found with ID: " + payslipId));
        return pdfGeneratorService.generatePayslipPdf(payslip, payslip.getEmployee());
    }

    // ==================== USER CONTEXT HELPERS (CONSOLIDATED) ====================

    /**
     * Extract current user from security context
     * Consolidated from UserContextService to reduce files
     */
    public Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                throw new RuntimeException("User not authenticated");
            }
            // Assuming the principal name is username or email
            String principal = authentication.getName();
            return userRepository.findByEmail(principal)
                    .map(user -> user.getEmployee().getId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + principal));
        } catch (Exception e) {
            throw new RuntimeException("Error extracting user context: " + e.getMessage());
        }
    }

    /**
     * Get current employee
     * Consolidated from EmployeeValidationService to reduce files
     */
    public Employee getCurrentEmployee() {
        Long employeeId = getCurrentUserId();
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found for current user"));
    }

    /**
     * Validate employee can access payslip
     * Employees can only access their own payslips
     */
    public boolean canAccessPayslip(Long payslipId, Long userId) {
        Payslip payslip = payslipRepository.findById(payslipId)
                .orElseThrow(() -> new RuntimeException("Payslip not found"));

        Employee employee = employeeRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return payslip.getEmployee().getId().equals(employee.getId());
    }

    // ==================== MAPPERS ====================

    private SalaryResponse mapToSalaryResponse(Salary salary) {
        return new SalaryResponse(
                salary.getId(),
                salary.getEmployee().getId(),
                salary.getEmployee().getFirstName() + " " + salary.getEmployee().getLastName(),
                salary.getEmployee().getEmail(),
                salary.getEmployee().getDepartment() != null ? salary.getEmployee().getDepartment().getName() : "N/A",
                salary.getBaseSalary(),
                salary.getPfPercentage(),
                salary.getEsiPercentage(),
                salary.getEffectiveFrom()
        );
    }

    private PayslipResponse mapToPayslipResponse(Payslip payslip) {
        return new PayslipResponse(
                payslip.getId(),
                payslip.getEmployee().getId(),
                payslip.getEmployee().getFirstName() + " " + payslip.getEmployee().getLastName(),
                payslip.getEmployee().getEmail(),
                payslip.getYear(),
                payslip.getMonth(),
                payslip.getBaseSalary(),
                payslip.getPfDeduction(),
                payslip.getEsiDeduction(),
                payslip.getTotalDeductions(),
                payslip.getNetSalary(),
                payslip.getGeneratedAt()
        );
    }

    private PayslipCalculationResult mapToCalculationResult(Payslip payslip) {
        return new PayslipCalculationResult(
                payslip.getBaseSalary(),
                payslip.getPfDeduction(),
                payslip.getEsiDeduction(),
                payslip.getTotalDeductions(),
                payslip.getNetSalary()
        );
    }
}
