package com.talenthub.backend.payload.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateSalaryRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Base salary is required")
    @DecimalMin(value = "0.01", message = "Base salary must be greater than 0")
    private BigDecimal baseSalary;

    @DecimalMin(value = "0", message = "PF percentage cannot be negative")
    private BigDecimal pfPercentage = BigDecimal.valueOf(12);

    @DecimalMin(value = "0", message = "ESI percentage cannot be negative")
    private BigDecimal esiPercentage = BigDecimal.valueOf(0.75);
}
