package com.safecircle.controller;

import com.safecircle.dto.EmergencyHistoryResponseDTO;
import com.safecircle.entity.User;
import com.safecircle.service.EmergencyHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/history")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class EmergencyHistoryController {

    private final EmergencyHistoryService historyService;

    @GetMapping
    public ResponseEntity<List<EmergencyHistoryResponseDTO>> getHistory(@AuthenticationPrincipal User user) {
        List<EmergencyHistoryResponseDTO> history = historyService.getEmergencyHistory(user.getId());
        return ResponseEntity.ok(history);
    }
}
