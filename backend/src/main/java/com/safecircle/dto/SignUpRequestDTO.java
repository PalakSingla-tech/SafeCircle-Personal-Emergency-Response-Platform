package com.safecircle.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequestDTO {
    @JsonAlias("name")
    private String fullName;
    private String email;
    private String phoneNumber;
    private String password;
}
