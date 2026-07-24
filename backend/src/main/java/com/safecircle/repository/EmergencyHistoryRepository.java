package com.safecircle.repository;

import com.safecircle.entity.EmergencyHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyHistoryRepository extends JpaRepository<EmergencyHistory, Long> {
    List<EmergencyHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}
