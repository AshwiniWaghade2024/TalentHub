package com.talenthub.backend.repository;

import com.talenthub.backend.entity.Employee;
import com.talenthub.backend.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    List<Salary> findByEmployee(Employee employee);
    Optional<Salary> findByEmployeeAndMonthAndYear(Employee employee, Integer month, Integer year);
}
