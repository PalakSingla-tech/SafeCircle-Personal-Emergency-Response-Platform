package com.safecircle.repository;

import com.safecircle.entity.QrScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QrScanRepository extends JpaRepository<QrScan, Long> {
    List<QrScan> findByUserIdOrderByTimestampDesc(Long userId);
    List<QrScan> findByUserIdAndTimestampAfter(Long userId, LocalDateTime timestamp);
}
