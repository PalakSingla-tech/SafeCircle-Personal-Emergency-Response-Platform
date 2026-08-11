package com.safecircle.controller;

import com.safecircle.dto.LoginRequestDTO;
import com.safecircle.dto.LoginResponseDTO;
import com.safecircle.dto.SignUpRequestDTO;
import com.safecircle.dto.SignUpResponseDTO;
import com.safecircle.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<String> forgotPassword(@RequestBody com.safecircle.dto.ForgotPasswordRequestDTO requestDTO) {
        authService.forgotPassword(requestDTO);
        return ResponseEntity.ok("{\"message\":\"Password reset link sent\"}");
    }

    @PostMapping({"/reset-password", "/api/reset-password", "/auth/reset-password"})
    public ResponseEntity<String> resetPassword(@RequestBody com.safecircle.dto.ResetPasswordRequestDTO requestDTO) {
        authService.resetPassword(requestDTO);
        return ResponseEntity.ok("{\"message\":\"Password updated successfully\"}");
    }
}
