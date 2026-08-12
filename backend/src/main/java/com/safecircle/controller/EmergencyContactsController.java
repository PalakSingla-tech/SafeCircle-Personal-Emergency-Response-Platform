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
    public ResponseEntity<EmergencyContactResponseDTO> addContact(
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

    @PutMapping({"/dashboard/emergency-contacts/{contactId}", "/api/dashboard/emergency-contacts/{contactId}"})
    public ResponseEntity<EmergencyContactResponseDTO> updateContact(
            @AuthenticationPrincipal User user,
            @PathVariable Long contactId,
            @RequestBody EmergencyContactRequestDTO emergencyContactRequestDTO)
    {
        return ResponseEntity.ok(emergencyContactsService.updateContact(user.getId(), contactId, emergencyContactRequestDTO));
    }

    @DeleteMapping({"/dashboard/emergency-contacts", "/api/dashboard/emergency-contacts"})
    public ResponseEntity<String> deleteContact(
            @AuthenticationPrincipal User user,
            @RequestParam Long id)
    {
        return ResponseEntity.ok(emergencyContactsService.deleteContact(user.getId(), id));
    }
}
