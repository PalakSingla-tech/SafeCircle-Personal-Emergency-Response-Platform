package com.safecircle.service;

import com.safecircle.dto.EmergencyContactResponseDTO;
import com.safecircle.dto.MedicalProfileDTO;
import com.safecircle.dto.PublicScanResponseDTO;
import com.safecircle.entity.User;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PublicScanService {

    private final UserRepository userRepository;
    private final MedicalProfileService medicalProfileService;
    private final EmergencyContactsService emergencyContactsService;
    private final EmergencyHistoryService emergencyHistoryService;

    public PublicScanResponseDTO getScanData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<MedicalProfileDTO> profileOpt = medicalProfileService.getMedicalProfile(userId);

        int age = 30; // Default or calculated from DOB
        String bloodGroup = "Unknown";
        List<String> medicalConditions = Collections.emptyList();
        List<String> currentMedications = Collections.emptyList();
        List<String> allergies = Collections.emptyList();
        String emergencyNotes = "None provided.";
        String doctorInfo = "None provided.";
        String primaryHospital = "None provided.";

        if (profileOpt.isPresent()) {
            MedicalProfileDTO profile = profileOpt.get();
            bloodGroup = profile.getBloodGroup() != null ? profile.getBloodGroup() : bloodGroup;
            emergencyNotes = profile.getEmergencyNotes() != null ? profile.getEmergencyNotes() : emergencyNotes;
            doctorInfo = profile.getPrimaryDoctor() != null ? profile.getPrimaryDoctor() : doctorInfo;
            primaryHospital = profile.getHospitalPreference() != null ? profile.getHospitalPreference() : primaryHospital;

            if (profile.getMedicalConditions() != null && !profile.getMedicalConditions().isEmpty()) {
                medicalConditions = List.of(profile.getMedicalConditions().split(","));
            }
            if (profile.getCurrentMedications() != null && !profile.getCurrentMedications().isEmpty()) {
                currentMedications = List.of(profile.getCurrentMedications().split(","));
            }
            if (profile.getAllergies() != null && !profile.getAllergies().isEmpty()) {
                allergies = List.of(profile.getAllergies().split(","));
            }
        }

        List<EmergencyContactResponseDTO> contacts = emergencyContactsService.showContacts(userId);
        if (contacts == null) {
            contacts = Collections.emptyList();
        }

        String avatarInitials = "";
        if (user.getFullName() != null && !user.getFullName().isEmpty()) {
            String[] parts = user.getFullName().split(" ");
            avatarInitials += parts[0].charAt(0);
            if (parts.length > 1) {
                avatarInitials += parts[parts.length - 1].charAt(0);
            }
        }

        return PublicScanResponseDTO.builder()
                .name(user.getFullName())
                .age(age)
                .bloodGroup(bloodGroup)
                .avatarInitials(avatarInitials.toUpperCase())
                .medicalConditions(medicalConditions)
                .currentMedications(currentMedications)
                .allergies(allergies)
                .emergencyNotes(emergencyNotes)
                .doctorInfo(doctorInfo)
                .primaryHospital(primaryHospital)
                .contacts(contacts)
                .build();
    }

    public void notifyEmergency(Long userId, String location) {
        // Create an emergency history record
        emergencyHistoryService.createEmergencyEvent(userId, location);
    }
}
