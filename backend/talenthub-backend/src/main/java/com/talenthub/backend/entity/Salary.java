package com.talenthub.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "salaries")
@Getter
@Setter
@NoArgsConstructor
public class Salary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private Integer month; // 1-12
    private Integer year;

    @Column(name = "basic_salary")
    private Double basicSalary;

    @Column(name = "pf_deduction")
    private Double pfDeduction;

    @Column(name = "esi_deduction")
    private Double esiDeduction;

    @Column(name = "net_salary")
    private Double netSalary;

    @Column(name = "pay_date")
    private LocalDate payDate;

    public Salary(Employee employee, Integer month, Integer year, Double basicSalary) {
        this.employee = employee;
        this.month = month;
        this.year = year;
        this.basicSalary = basicSalary;
        this.payDate = LocalDate.now();
    }
}
