package com.talenthub.backend.repository;

import com.talenthub.backend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Boolean existsByEmail(String email);

    // Department Headcount Report
    @Query("SELECT e.department.name, COUNT(e) FROM Employee e GROUP BY e.department.name")
    List<Object[]> getDepartmentHeadcount();

    // Overall Payroll Summary Report (Total Company Cost)
    @Query("SELECT SUM(e.basicSalary) FROM Employee e")
    Double getTotalMonthlyPayroll();
}
