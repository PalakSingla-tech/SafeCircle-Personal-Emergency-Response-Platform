package com.safecircle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmergencyContactResponseDTO {
    private Long id;

    @JsonProperty("name")
    private String contactName;

    @JsonProperty("phone")
    private String phoneNumber;
    private String relationship;
    private Integer priorityOrder;
}
