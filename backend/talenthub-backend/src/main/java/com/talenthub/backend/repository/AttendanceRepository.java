package com.talenthub.backend.repository;

import com.talenthub.backend.entity.Attendance;
import com.talenthub.backend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeAndDate(Employee employee, LocalDate date);
    java.util.List<Attendance> findByEmployeeOrderByDateDesc(Employee employee);
}
