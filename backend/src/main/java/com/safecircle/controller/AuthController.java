package com.safecircle.controller;

import com.safecircle.dto.*;
import com.safecircle.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    @PostMapping({"/register", "/api/register", "/auth/register"})
    public ResponseEntity<SignUpResponseDTO> register(@RequestBody SignUpRequestDTO signUpRequestDTO)
    {
        return ResponseEntity.ok(authService.register(signUpRequestDTO));
    }

    @PostMapping({"/login", "/api/login", "/auth/login"})
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO)
    {
        return ResponseEntity.ok(authService.login(loginRequestDTO));
    }

    @PostMapping({"/forgot-password", "/api/forgot-password", "/auth/forgot-password"})
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequestDTO requestDTO) {
        authService.forgotPassword(requestDTO);
        return ResponseEntity.ok("{\"message\":\"Password reset link sent\"}");
    }

    @PostMapping({"/reset-password", "/api/reset-password", "/auth/reset-password"})
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequestDTO requestDTO) {
        authService.resetPassword(requestDTO);
        return ResponseEntity.ok("{\"message\":\"Password updated successfully\"}");
    }

    @org.springframework.web.bind.annotation.ExceptionHandler({AuthenticationException.class, RuntimeException.class})
    public ResponseEntity<Map<String, String>> handleAuthExceptions(Exception ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", ex.getMessage()));
    }
}
