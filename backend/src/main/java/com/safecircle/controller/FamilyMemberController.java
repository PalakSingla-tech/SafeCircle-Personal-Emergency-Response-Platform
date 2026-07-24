package com.safecircle.controller;

import com.safecircle.dto.FamilyMemberRequestDTO;
import com.safecircle.dto.FamilyMemberResponseDTO;
import com.safecircle.entity.User;
import com.safecircle.service.FamilyMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/family-members")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class FamilyMemberController {

    private final FamilyMemberService familyMemberService;

    @GetMapping
    public ResponseEntity<List<FamilyMemberResponseDTO>> getFamilyMembers(@AuthenticationPrincipal User user) {
        List<FamilyMemberResponseDTO> members = familyMemberService.getFamilyMembers(user.getId());
        return ResponseEntity.ok(members);
    }

    @PostMapping
    public ResponseEntity<FamilyMemberResponseDTO> addFamilyMember(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody FamilyMemberRequestDTO request) {
        FamilyMemberResponseDTO response = familyMemberService.addFamilyMember(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FamilyMemberResponseDTO> updateFamilyMember(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody FamilyMemberRequestDTO request) {
        FamilyMemberResponseDTO response = familyMemberService.updateFamilyMember(user.getId(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFamilyMember(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        familyMemberService.removeFamilyMember(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
