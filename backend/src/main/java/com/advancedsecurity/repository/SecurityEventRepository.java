package com.advancedsecurity.repository;

import com.advancedsecurity.model.SecurityEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityEventRepository extends JpaRepository<SecurityEvent, String> {
    List<SecurityEvent> findBySeverity(String severity);
}
