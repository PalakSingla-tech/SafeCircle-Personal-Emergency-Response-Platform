package com.safecircle.controller;

import com.safecircle.dto.EmergencyContactRequestDTO;
import com.safecircle.dto.EmergencyContactResponseDTO;
import com.safecircle.entity.User;
import com.safecircle.service.EmergencyContactsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class EmergencyContactsController {

    private final EmergencyContactsService emergencyContactsService;

    @PostMapping({"/dashboard/emergency-contacts", "/api/dashboard/emergency-contacts"})
    public ResponseEntity<String> addContact(
            @AuthenticationPrincipal User user,
            @RequestBody EmergencyContactRequestDTO emergencyContactRequestDTO)
    {
        return ResponseEntity.ok(emergencyContactsService.addContact(user.getId(), emergencyContactRequestDTO));
    }

    @GetMapping({"/dashboard/emergency-contacts", "/api/dashboard/emergency-contacts"})
    public ResponseEntity<List<EmergencyContactResponseDTO>> showContacts(@AuthenticationPrincipal User user)
    {
        return ResponseEntity.ok(emergencyContactsService.showContacts(user.getId()));
    }

}
