package com.safecircle.controller;

import com.safecircle.dto.DashboardResponseDTO;
import com.safecircle.entity.User;
import com.safecircle.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping({"/dashboard", "/api/dashboard"})
    public ResponseEntity<DashboardResponseDTO> getDashboard(@AuthenticationPrincipal User user) {
        DashboardResponseDTO dashboard = dashboardService.getDashboardData(user.getId(), user);
        return ResponseEntity.ok(dashboard);
    }
}
