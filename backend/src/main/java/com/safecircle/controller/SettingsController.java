package com.safecircle.controller;

import com.safecircle.dto.SettingsPasswordRequestDTO;
import com.safecircle.dto.SettingsProfileRequestDTO;
import com.safecircle.entity.User;
import com.safecircle.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class SettingsController {

    private final SettingsService settingsService;

    @PutMapping("/profile")
    public ResponseEntity<Void> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SettingsProfileRequestDTO request) {
        settingsService.updateProfile(user.getId(), request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SettingsPasswordRequestDTO request) {
        settingsService.updatePassword(user.getId(), request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<com.safecircle.dto.SettingsDTO> getSettings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(settingsService.getUserSettings(user.getId()));
    }

    @PutMapping
    public ResponseEntity<com.safecircle.dto.SettingsDTO> updateSettings(
            @AuthenticationPrincipal User user,
            @RequestBody com.safecircle.dto.SettingsDTO request) {
        return ResponseEntity.ok(settingsService.updateUserSettings(user.getId(), request));
    }
}
