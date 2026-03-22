package com.talenthub.backend.repository;

import com.talenthub.backend.entity.ELeaveStatus;
import com.talenthub.backend.entity.Employee;
import com.talenthub.backend.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployee(Employee employee);
    List<LeaveRequest> findByStatus(ELeaveStatus status);
}
