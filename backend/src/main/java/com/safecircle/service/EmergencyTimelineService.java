package com.safecircle.service;

import com.safecircle.entity.EmergencyTimelineEvent;
import com.safecircle.repository.EmergencyTimelineEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyTimelineService {
    private final EmergencyTimelineEventRepository repository;

    public void logEvent(Long alertId, String eventLabel) {
        EmergencyTimelineEvent event = EmergencyTimelineEvent.builder()
                .alertId(alertId)
                .eventLabel(eventLabel)
                .build();
        repository.save(event);
    }

    public List<Map<String, String>> getTimeline(Long alertId) {
        List<EmergencyTimelineEvent> events = repository.findByAlertIdOrderByEventTimeAsc(alertId);
        return events.stream().map(e -> Map.of(
                "id", String.valueOf(e.getId()),
                "label", e.getEventLabel(),
                "time", e.getEventTime().toString()
        )).collect(Collectors.toList());
    }
}
