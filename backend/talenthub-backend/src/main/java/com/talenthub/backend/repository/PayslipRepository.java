package com.talenthub.backend.repository;

import com.talenthub.backend.entity.Payslip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayslipRepository extends JpaRepository<Payslip, Long> {
    Optional<Payslip> findByEmployeeIdAndYearAndMonth(Long employeeId, Integer year, Integer month);
    List<Payslip> findByEmployeeIdOrderByYearDescMonthDesc(Long employeeId);
    Page<Payslip> findByEmployeeIdOrderByYearDescMonthDesc(Long employeeId, Pageable pageable);
    List<Payslip> findByYearAndMonth(Integer year, Integer month);
    Page<Payslip> findByYearAndMonthOrderByEmployeeId(Integer year, Integer month, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(p.netSalary) FROM Payslip p WHERE p.year = :year AND p.month = :month")
    java.math.BigDecimal sumNetSalaryByYearAndMonth(@org.springframework.data.repository.query.Param("year") Integer year, @org.springframework.data.repository.query.Param("month") Integer month);
}
