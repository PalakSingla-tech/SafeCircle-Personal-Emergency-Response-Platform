package com.safecircle.controller;

import com.safecircle.dto.PublicScanResponseDTO;
import com.safecircle.service.PublicScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/public/scan")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class PublicScanController {

    private final PublicScanService publicScanService;

    @GetMapping("/{id}")
    public ResponseEntity<PublicScanResponseDTO> getScanData(@PathVariable Long id) {
        PublicScanResponseDTO data = publicScanService.getScanData(id);
        return ResponseEntity.ok(data);
    }

    @PostMapping("/{id}/notify")
    public ResponseEntity<?> notifyEmergency(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        try {
            String location = null;
            if (payload != null && payload.containsKey("location")) {
                location = payload.get("location");
            }
            Long alertId = publicScanService.notifyEmergency(id, location);
            return ResponseEntity.ok(Map.of("alertId", alertId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Unknown error"));
        }
    }
}
