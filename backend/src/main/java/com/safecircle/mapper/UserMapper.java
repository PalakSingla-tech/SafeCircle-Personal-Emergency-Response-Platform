package com.safecircle.mapper;

import com.safecircle.dto.SignUpRequestDTO;
import com.safecircle.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public User toEntity(SignUpRequestDTO dto)
    {
        return User.builder()
                .email(dto.getEmail())
                .fullName(dto.getFullName())
                .password(dto.getPassword())
                .phoneNumber(dto.getPhoneNumber())
                .build();
    }
}
