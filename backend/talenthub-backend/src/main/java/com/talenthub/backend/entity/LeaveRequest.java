package com.talenthub.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
@Getter
@Setter
@NoArgsConstructor
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @NotBlank
    private String reason;

    @NotBlank
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ELeaveStatus status = ELeaveStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_user_id")
    private User manager; // The user (Manager/HR) who approves it

    public LeaveRequest(Employee employee, LocalDate startDate, LocalDate endDate, String reason, String type) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
        this.type = type;
    }
}
