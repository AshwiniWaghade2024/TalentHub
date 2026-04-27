package com.talenthub.backend.repository;

import com.talenthub.backend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Boolean existsByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE e.createdBy.id = :userId")
    List<Employee> findByCreatedBy_Id(@org.springframework.data.repository.query.Param("userId") Long userId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Employee e SET e.createdBy = NULL WHERE e.createdBy.id = :userId")
    void detachEmployeesByCreatorId(@org.springframework.data.repository.query.Param("userId") Long userId);

    long countByRoleName(com.talenthub.backend.entity.ERole name);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.role IS NULL OR e.role.name = :roleName")
    long countEmployeesWithRoleOrNull(@org.springframework.data.repository.query.Param("roleName") com.talenthub.backend.entity.ERole roleName);

    // Department Headcount Report
    @Query("SELECT e.department.name, COUNT(e) FROM Employee e GROUP BY e.department.name")
    List<Object[]> getDepartmentHeadcount();

    // Overall Payroll Summary Report (Total Company Cost)
    @Query("SELECT SUM(e.basicSalary) FROM Employee e")
    Double getTotalMonthlyPayroll();
}
