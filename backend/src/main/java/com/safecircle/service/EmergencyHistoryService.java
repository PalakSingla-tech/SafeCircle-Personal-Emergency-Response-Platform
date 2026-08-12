package com.safecircle.service;

import com.safecircle.dto.EmergencyHistoryResponseDTO;
import com.safecircle.entity.EmergencyHistory;
import com.safecircle.entity.User;
import com.safecircle.repository.EmergencyHistoryRepository;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyHistoryService {

    private final EmergencyHistoryRepository repository;
    private final UserRepository userRepository;

    public List<EmergencyHistoryResponseDTO> getEmergencyHistory(Long userId) {
        List<EmergencyHistory> historyList = repository.findByUserIdOrderByCreatedAtDesc(userId);
        
        return historyList.stream().map(history -> EmergencyHistoryResponseDTO.builder()
                .id(String.valueOf(history.getId()))
                .date(history.getDate())
                .time(history.getTime())
                .location(history.getLocation())
                .responder(history.getResponder())
                .hospital(history.getHospital())
                .type(history.getType())
                .status(history.getStatus())
                .build()).collect(Collectors.toList());
    }

    public Long createEmergencyEvent(Long userId, String location) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EmergencyHistory event = EmergencyHistory.builder()
                .user(user)
                .date(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                .time(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                .location(location != null ? location : "Unknown Location")
                .responder("First Responder")
                .hospital("Pending Assignment")
                .type("Medical Emergency")
                .status("Active")
                .build();

        event = repository.save(event);
        return event.getId();
    }

    public void resolveEmergencyEvent(Long eventId, Long userId) {
        EmergencyHistory event = repository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!event.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        event.setStatus("Resolved");
        repository.save(event);
    }

    public void resolveEmergencyEvent(Long eventId) {
        EmergencyHistory event = repository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus("Resolved");
        repository.save(event);
    }
}
