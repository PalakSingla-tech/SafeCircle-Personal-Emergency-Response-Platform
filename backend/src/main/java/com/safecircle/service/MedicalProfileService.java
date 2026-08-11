package com.safecircle.service;

import com.safecircle.dto.MedicalProfileDTO;
import com.safecircle.entity.MedicalProfile;
import com.safecircle.entity.User;
import com.safecircle.mapper.MedicalProfileMapper;
import com.safecircle.repository.MedicalProfileRepository;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MedicalProfileService {

    private final MedicalProfileRepository medicalProfileRepository;
    private final MedicalProfileMapper medicalProfileMapper;
    private final UserRepository userRepository;

    public String createMedicalProfile(Long userId, MedicalProfileDTO medicalProfileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MedicalProfile medicalProfile = medicalProfileRepository.findByUser(user)
                .orElse(new MedicalProfile());
        
        MedicalProfile updatedProfile = medicalProfileMapper.toEntity(medicalProfileDTO);
        
        medicalProfile.setUser(user);
        medicalProfile.setDob(updatedProfile.getDob());
        medicalProfile.setGender(updatedProfile.getGender());
        medicalProfile.setBloodGroup(updatedProfile.getBloodGroup());
        medicalProfile.setHeight(updatedProfile.getHeight());
        medicalProfile.setWeight(updatedProfile.getWeight());
        medicalProfile.setMedicalConditions(updatedProfile.getMedicalConditions());
        medicalProfile.setCurrentMedications(updatedProfile.getCurrentMedications());
        medicalProfile.setAllergies(updatedProfile.getAllergies());
        medicalProfile.setPastSurgeries(updatedProfile.getPastSurgeries());
        medicalProfile.setDisabilities(updatedProfile.getDisabilities());
        medicalProfile.setOrganDonor(updatedProfile.getOrganDonor());
        medicalProfile.setEmergencyNotes(updatedProfile.getEmergencyNotes());
        medicalProfile.setInsuranceProvider(updatedProfile.getInsuranceProvider());
        medicalProfile.setPolicyNumber(updatedProfile.getPolicyNumber());
        medicalProfile.setPrimaryDoctor(updatedProfile.getPrimaryDoctor());
        medicalProfile.setHospitalPreference(updatedProfile.getHospitalPreference());

        medicalProfileRepository.save(medicalProfile);
        return "Medical Profile saved successfully";
    }

    public Optional<MedicalProfileDTO> getMedicalProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return medicalProfileRepository.findByUser(user)
                .map(medicalProfileMapper::toResponseDTO);
    }
}
