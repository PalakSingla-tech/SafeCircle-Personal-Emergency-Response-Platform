package com.safecircle.mapper;

import com.safecircle.dto.MedicalProfileDTO;
import com.safecircle.entity.MedicalProfile;
import org.springframework.stereotype.Component;

@Component
public class MedicalProfileMapper {
    public MedicalProfile toEntity(MedicalProfileDTO dto)
    {
        return MedicalProfile.builder()
                .dob(dto.getDob())
                .gender(dto.getGender())
                .bloodGroup(dto.getBloodGroup())
                .height(dto.getHeight())
                .weight(dto.getWeight())
                .medicalConditions(dto.getMedicalConditions())
                .currentMedications(dto.getCurrentMedications())
                .allergies(dto.getAllergies())
                .pastSurgeries(dto.getPastSurgeries())
                .disabilities(dto.getDisabilities())
                .organDonor(dto.getOrganDonor())
                .emergencyNotes(dto.getEmergencyNotes())
                .insuranceProvider(dto.getInsuranceProvider())
                .policyNumber(dto.getPolicyNumber())
                .primaryDoctor(dto.getPrimaryDoctor())
                .hospitalPreference(dto.getHospitalPreference())
                .build();
    }

    public MedicalProfileDTO toResponseDTO(MedicalProfile medicalProfile) {
        MedicalProfileDTO dto = new MedicalProfileDTO();
        dto.setDob(medicalProfile.getDob());
        dto.setGender(medicalProfile.getGender());
        dto.setBloodGroup(medicalProfile.getBloodGroup());
        dto.setHeight(medicalProfile.getHeight());
        dto.setWeight(medicalProfile.getWeight());
        dto.setMedicalConditions(medicalProfile.getMedicalConditions());
        dto.setCurrentMedications(medicalProfile.getCurrentMedications());
        dto.setAllergies(medicalProfile.getAllergies());
        dto.setPastSurgeries(medicalProfile.getPastSurgeries());
        dto.setDisabilities(medicalProfile.getDisabilities());
        dto.setOrganDonor(medicalProfile.getOrganDonor());
        dto.setEmergencyNotes(medicalProfile.getEmergencyNotes());
        dto.setInsuranceProvider(medicalProfile.getInsuranceProvider());
        dto.setPolicyNumber(medicalProfile.getPolicyNumber());
        dto.setPrimaryDoctor(medicalProfile.getPrimaryDoctor());
        dto.setHospitalPreference(medicalProfile.getHospitalPreference());
        return dto;
    }
}
