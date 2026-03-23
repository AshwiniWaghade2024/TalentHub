package com.talenthub.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Internal DTO returned by PayslipCalculationService
 * Contains calculated salary components
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PayslipCalculationResult {
    private BigDecimal baseSalary;
    private BigDecimal pfDeduction;
    private BigDecimal esiDeduction;
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;
}
