package com.safecircle.controller;

import com.safecircle.dto.QrCardResponseDTO;
import com.safecircle.entity.User;
import com.safecircle.service.QrCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/qr-card")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class QrCardController {

    private final QrCardService qrCardService;

    @GetMapping
    public ResponseEntity<QrCardResponseDTO> getQrCard(@AuthenticationPrincipal User user) {
        QrCardResponseDTO response = qrCardService.generateQrCardData(user.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<QrCardResponseDTO> updateQrCard(@AuthenticationPrincipal User user, @RequestBody QrCardResponseDTO payload) {
        QrCardResponseDTO response = qrCardService.updateQrCardData(user.getId(), payload);
        return ResponseEntity.ok(response);
    }
}
