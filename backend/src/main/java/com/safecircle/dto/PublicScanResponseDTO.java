package com.safecircle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicScanResponseDTO {
    private String name;
    private int age;
    private String bloodGroup;
    private String avatarInitials;
    private List<String> medicalConditions;
    private List<String> currentMedications;
    private List<String> allergies;
    private String emergencyNotes;
    private String doctorInfo;
    private String primaryHospital;
    private List<EmergencyContactResponseDTO> contacts;
}
