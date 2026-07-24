package com.safecircle.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmergencyContactRequestDTO {
    @Column(nullable = false)
    private String contactName;

    @Column(nullable = false)
    private String phoneNumber;

    private String relationship;
}
