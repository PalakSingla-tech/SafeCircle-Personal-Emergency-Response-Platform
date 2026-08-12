package com.safecircle.controller;

import com.safecircle.dto.LocationRequestDTO;
import com.safecircle.dto.LocationResponseDTO;
import com.safecircle.entity.User;
import com.safecircle.service.LocationSharingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/location")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class LocationSharingController {

    private final LocationSharingService locationSharingService;

    @PostMapping
    public ResponseEntity<?> updateLocation(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody LocationRequestDTO request) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        LocationResponseDTO response = locationSharingService.updateLocation(user.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{alertId}")
    public ResponseEntity<LocationResponseDTO> getLocation(
            @PathVariable Long alertId) {
        LocationResponseDTO response = locationSharingService.getLocation(alertId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<?> getSharedLocations(
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        List<LocationResponseDTO> locations = locationSharingService.getSharedLocations(user.getId());
        return ResponseEntity.ok(locations);
    }
}
