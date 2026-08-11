package com.safecircle.repository;

import com.safecircle.entity.EmergencyTimelineEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyTimelineEventRepository extends JpaRepository<EmergencyTimelineEvent, Long> {
    List<EmergencyTimelineEvent> findByAlertIdOrderByEventTimeAsc(Long alertId);
}
