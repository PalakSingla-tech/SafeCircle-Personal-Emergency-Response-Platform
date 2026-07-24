package com.safecircle.security;

import com.safecircle.dto.LoginRequestDTO;
import com.safecircle.dto.LoginResponseDTO;
import com.safecircle.dto.SignUpRequestDTO;
import com.safecircle.dto.SignUpResponseDTO;
import com.safecircle.entity.User;
import com.safecircle.mapper.UserMapper;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final AuthUtil authUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public SignUpResponseDTO register(SignUpRequestDTO signUpRequestDTO) {
        if(userRepository.findByEmail(signUpRequestDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User already exists with this email id");
        }

        User user = userMapper.toEntity(signUpRequestDTO);
        user.setPassword(passwordEncoder.encode(signUpRequestDTO.getPassword()));
        user = userRepository.save(user);
        return new SignUpResponseDTO(user.getId(), user.getEmail());
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(),
                        loginRequestDTO.getPassword())
        );
        user = (User) authentication.getPrincipal();
        String token = authUtil.generateAccessToken(user);
        return new LoginResponseDTO(user.getId(), token);
    }
}
