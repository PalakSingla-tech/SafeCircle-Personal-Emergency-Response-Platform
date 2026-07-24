package com.safecircle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrCardResponseDTO {
    private String profileId;
    private String status;
    private String lastUpdated;
    private String shareUrl;
    private String name;
    private String dob;
    private String bloodGroup;
    private String allergies;
    private String contact;
}
