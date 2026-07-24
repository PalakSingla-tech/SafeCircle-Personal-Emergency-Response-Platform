package com.safecircle.dto;

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
    private String contactName;
    private String phoneNumber;
    private String relationship;
    private Integer priorityOrder;
}
