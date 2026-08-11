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

@RestController
@RequestMapping("/location")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class LocationSharingController {

    private final LocationSharingService locationSharingService;

    @PostMapping
    public ResponseEntity<LocationResponseDTO> updateLocation(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody LocationRequestDTO request) {
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
    public ResponseEntity<java.util.List<LocationResponseDTO>> getSharedLocations(
            @AuthenticationPrincipal User user) {
        java.util.List<LocationResponseDTO> locations = locationSharingService.getSharedLocations(user.getId());
        return ResponseEntity.ok(locations);
    }
}
