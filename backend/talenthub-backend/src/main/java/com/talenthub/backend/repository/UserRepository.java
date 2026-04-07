package com.talenthub.backend.repository;

import com.talenthub.backend.entity.User;
import com.talenthub.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Optional<User> findByEmployee(com.talenthub.backend.entity.Employee employee);
    Boolean existsByEmployee(com.talenthub.backend.entity.Employee employee);
    List<User> findByRole(Role role);
    long countByRole(Role role);
}
