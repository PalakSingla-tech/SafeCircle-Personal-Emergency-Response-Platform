package com.safecircle.controller;

import com.safecircle.dto.MedicalProfileDTO;
import com.safecircle.entity.User;
import com.safecircle.service.MedicalProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class MedicalProfileController {

    private final MedicalProfileService medicalProfileService;

    @PostMapping({"/dashboard/medical-profile", "/api/dashboard/medical-profile"})
    public ResponseEntity<String> medicalProfile(
            @AuthenticationPrincipal User user,
            @RequestBody MedicalProfileDTO medicalProfileDTO)
    {
        Long id = user.getId();
        return ResponseEntity.ok(medicalProfileService.createMedicalProfile(id, medicalProfileDTO));
    }

    @GetMapping({"/dashboard/medical-profile", "/api/dashboard/medical-profile"})
    public ResponseEntity<MedicalProfileDTO> getMedicalProfile(@AuthenticationPrincipal User user) {
        Optional<MedicalProfileDTO> profile = medicalProfileService.getMedicalProfile(user.getId());
        return profile.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
