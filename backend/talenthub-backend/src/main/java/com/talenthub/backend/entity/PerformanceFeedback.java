package com.talenthub.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "performance_feedback")
@Getter
@Setter
@NoArgsConstructor
public class PerformanceFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "submitted_by_user_id", nullable = false)
    private Long submittedByUserId; // The HR/Admin user who gave feedback

    @Column(name = "feedback_text", length = 1000)
    private String feedbackText;

    @Column(name = "feedback_date")
    private LocalDate feedbackDate;

    private String kpi;
    private Integer rating; // 1-5 stars
    private String promotionRecommendation; // e.g., "Yes", "No", "Maybe"

    public PerformanceFeedback(Employee employee, Long submittedByUserId, String feedbackText) {
        this.employee = employee;
        this.submittedByUserId = submittedByUserId;
        this.feedbackText = feedbackText;
        this.feedbackDate = LocalDate.now();
    }
}
