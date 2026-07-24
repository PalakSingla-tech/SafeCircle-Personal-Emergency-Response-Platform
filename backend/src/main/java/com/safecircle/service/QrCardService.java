package com.safecircle.service;

import com.safecircle.dto.EmergencyContactResponseDTO;
import com.safecircle.dto.MedicalProfileDTO;
import com.safecircle.dto.QrCardResponseDTO;
import com.safecircle.entity.User;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QrCardService {

    private final UserRepository userRepository;
    private final MedicalProfileService medicalProfileService;
    private final EmergencyContactsService emergencyContactsService;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public QrCardResponseDTO generateQrCardData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<MedicalProfileDTO> profileOpt = medicalProfileService.getMedicalProfile(userId);
        String bloodType = "Unknown";
        String allergiesList = "None known";
        String dob = "Not specified";

        if (profileOpt.isPresent()) {
            MedicalProfileDTO profile = profileOpt.get();
            if (profile.getBloodGroup() != null && !profile.getBloodGroup().isEmpty()) {
                bloodType = profile.getBloodGroup();
            }
            if (profile.getAllergies() != null && !profile.getAllergies().isEmpty()) {
                allergiesList = profile.getAllergies();
            }
            if (profile.getDob() != null) {
                dob = profile.getDob().toString();
            }
        }

        List<EmergencyContactResponseDTO> contacts = emergencyContactsService.showContacts(userId);
        String contactInfo = "None";
        if (contacts != null && !contacts.isEmpty()) {
            contactInfo = contacts.get(0).getPhoneNumber();
        }

        // The URL the QR code will point to, for first responders to view the emergency profile
        String profileId = "USR-" + userId;
        String shareUrl = frontendUrl + "/scan/" + userId;

        return QrCardResponseDTO.builder()
                .profileId(profileId)
                .status("active")
                .lastUpdated("Just now")
                .shareUrl(shareUrl)
                .name(user.getFullName())
                .dob(dob)
                .bloodGroup(bloodType)
                .allergies(allergiesList)
                .contact(contactInfo)
                .build();
    }
    
    public QrCardResponseDTO updateQrCardData(Long userId, QrCardResponseDTO payload) {
        // In a real app, you might regenerate a unique hash or update the DB status.
        // For now, simply regenerate the data so it gets the fresh DB state.
        return generateQrCardData(userId);
    }
}
