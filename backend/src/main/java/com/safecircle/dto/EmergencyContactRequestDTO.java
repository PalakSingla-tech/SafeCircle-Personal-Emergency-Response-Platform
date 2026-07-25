package com.safecircle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmergencyContactRequestDTO {
    @Column(nullable = false)
    @JsonProperty("name")
    private String contactName;

    @Column(nullable = false)
    @JsonProperty("phone")
    private String phoneNumber;

    private String relationship;
}
