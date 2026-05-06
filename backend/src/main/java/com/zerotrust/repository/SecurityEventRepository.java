package com.zerotrust.repository;

import com.zerotrust.model.SecurityEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SecurityEventRepository extends JpaRepository<SecurityEvent, Long> {
    List<SecurityEvent> findAllByOrderByTimestampDesc();
    List<SecurityEvent> findBySeverity(String severity);
}
