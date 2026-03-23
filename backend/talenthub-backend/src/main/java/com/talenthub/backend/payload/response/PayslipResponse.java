package com.talenthub.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PayslipResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private Integer year;
    private Integer month;
    private BigDecimal baseSalary;
    private BigDecimal pfDeduction;
    private BigDecimal esiDeduction;
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;
    private LocalDateTime generatedAt;
}
