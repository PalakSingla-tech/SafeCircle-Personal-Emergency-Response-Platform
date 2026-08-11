package com.safecircle.controller;

import com.safecircle.service.EmergencyTimelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/timeline")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class EmergencyTimelineController {

    private final EmergencyTimelineService timelineService;

    @GetMapping("/{alertId}")
    public ResponseEntity<List<Map<String, String>>> getTimeline(@PathVariable Long alertId) {
        return ResponseEntity.ok(timelineService.getTimeline(alertId));
    }
}
