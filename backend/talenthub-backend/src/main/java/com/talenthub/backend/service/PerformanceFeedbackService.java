package com.talenthub.backend.service;

import com.talenthub.backend.entity.Employee;
import com.talenthub.backend.entity.PerformanceFeedback;
import com.talenthub.backend.repository.PerformanceFeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PerformanceFeedbackService {

    @Autowired
    private PerformanceFeedbackRepository repo;

    public PerformanceFeedback submitFeedback(PerformanceFeedback feedback) {
        feedback.setFeedbackDate(LocalDate.now());
        return repo.save(feedback);
    }

    public List<PerformanceFeedback> getEmployeeFeedback(Employee employee) {
        return repo.findByEmployee(employee);
    }
}
