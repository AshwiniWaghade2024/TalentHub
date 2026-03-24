package com.talenthub.backend.repository;

import com.talenthub.backend.entity.Employee;
import com.talenthub.backend.entity.PerformanceFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformanceFeedbackRepository extends JpaRepository<PerformanceFeedback, Long> {
    List<PerformanceFeedback> findByEmployee(Employee employee);
}
