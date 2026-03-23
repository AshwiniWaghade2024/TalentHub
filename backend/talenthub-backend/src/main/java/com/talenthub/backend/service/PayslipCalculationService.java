package com.talenthub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Pure calculation service for salary deductions
 * No database dependencies - highly testable
 */
@Service
@RequiredArgsConstructor
public class PayslipCalculationService {

    /**
     * Calculate PF (Provident Fund) deduction
     */
    public BigDecimal calculatePFDeduction(BigDecimal baseSalary, BigDecimal pfPercentage) {
        return baseSalary
                .multiply(pfPercentage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate ESI (Employee State Insurance) deduction
     */
    public BigDecimal calculateESIDeduction(BigDecimal baseSalary, BigDecimal esiPercentage) {
        return baseSalary
                .multiply(esiPercentage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate total deductions
     */
    public BigDecimal calculateTotalDeductions(BigDecimal pfDeduction, BigDecimal esiDeduction) {
        return pfDeduction.add(esiDeduction);
    }

    /**
     * Calculate net salary
     */
    public BigDecimal calculateNetSalary(BigDecimal baseSalary, BigDecimal totalDeductions) {
        return baseSalary.subtract(totalDeductions);
    }
}
