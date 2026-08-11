package com.safecircle.controller;

import com.safecircle.dto.NotificationDTO;
import com.safecircle.entity.User;
import com.safecircle.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getId()));
    }

    @PatchMapping
    public ResponseEntity<List<NotificationDTO>> markNotificationsAsRead(@AuthenticationPrincipal User user, @RequestBody Map<String, String> payload) {
        if ("mark-all-read".equals(payload.get("action"))) {
            notificationService.markAsRead(user.getId());
        }
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getId()));
    }
}
