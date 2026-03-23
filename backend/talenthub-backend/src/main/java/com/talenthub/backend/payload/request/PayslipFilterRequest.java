package com.talenthub.backend.payload.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Optional filter/query parameters for payslip searches
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PayslipFilterRequest {
    private Integer year;
    private Integer month;
    private Long employeeId;
    private Integer pageNumber = 0;
    private Integer pageSize = 20;
}
