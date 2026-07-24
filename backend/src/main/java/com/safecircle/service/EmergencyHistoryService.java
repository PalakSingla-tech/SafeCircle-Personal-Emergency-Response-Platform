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

    public void createEmergencyEvent(Long userId, String location) {
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

        repository.save(event);
    }
}
