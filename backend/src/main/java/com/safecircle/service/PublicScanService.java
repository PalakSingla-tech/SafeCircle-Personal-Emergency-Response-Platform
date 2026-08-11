package com.safecircle.service;

import com.safecircle.dto.EmergencyContactResponseDTO;
import com.safecircle.dto.MedicalProfileDTO;
import com.safecircle.dto.PublicScanResponseDTO;
import com.safecircle.entity.User;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.safecircle.entity.QrScan;
import com.safecircle.repository.QrScanRepository;

@Service
@RequiredArgsConstructor
public class PublicScanService {

    private final UserRepository userRepository;
    private final MedicalProfileService medicalProfileService;
    private final EmergencyContactsService emergencyContactsService;
    private final EmergencyHistoryService emergencyHistoryService;
    private final SmsService smsService;
    private final NotificationService notificationService;
    private final EmergencyTimelineService timelineService;
    private final QrScanRepository qrScanRepository;

    public PublicScanResponseDTO getScanData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Log the QR Scan
        QrScan scan = QrScan.builder()
                .user(user)
                .timestamp(LocalDateTime.now())
                .location("Unknown Location") // Can be updated if they share location
                .deviceType("Mobile Browser")
                .build();
        qrScanRepository.save(scan);

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
            if (profile.getDob() != null) {
                age = java.time.Period.between(profile.getDob(), java.time.LocalDate.now()).getYears();
            }
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

    public Long notifyEmergency(Long userId, String location) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create an emergency history record
        Long alertId = emergencyHistoryService.createEmergencyEvent(userId, location);

        List<EmergencyContactResponseDTO> contacts = emergencyContactsService.showContacts(userId);
        if (contacts != null) {
            String mapsLink = (location != null && !location.isEmpty()) ? 
                    "https://maps.google.com/?q=" + location.replace(" ", "+") : 
                    "Location not provided.";
            
            String message = "🚨 Emergency Alert\n" +
                    user.getFullName() + " has triggered an emergency.\n" +
                    "Current Location:\n" +
                    mapsLink + "\n" +
                    "Please contact them immediately.";

            for (EmergencyContactResponseDTO contact : contacts) {
                if (contact.getPhoneNumber() != null && !contact.getPhoneNumber().isEmpty()) {
                    smsService.sendSms(contact.getPhoneNumber(), message);
                }
            }
        }
        
        notificationService.createNotification(
                userId, 
                "Emergency Triggered!", 
                "Your emergency QR was scanned and an alert was sent to your contacts.", 
                "alert"
        );
        
        timelineService.logEvent(alertId, "QR Scanned");
        timelineService.logEvent(alertId, "Emergency Alert Sent");
        
        return alertId;
    }
}
