package com.talenthub.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users", uniqueConstraints = { @UniqueConstraint(columnNames = "username") })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(length = 50)
    private String username;

    @NotBlank
    @Column(name = "password_hash", length = 120)
    private String password;

    @Column(name = "temporary_password_flag")
    private boolean temporaryPasswordFlag = false;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = true)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public boolean isTemporaryPasswordFlag() { return temporaryPasswordFlag; }
    public void setTemporaryPasswordFlag(boolean flag) { this.temporaryPasswordFlag = flag; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
