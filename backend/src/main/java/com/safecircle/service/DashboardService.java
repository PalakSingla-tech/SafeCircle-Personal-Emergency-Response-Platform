package com.safecircle.service;

import com.safecircle.dto.DashboardResponseDTO;
import com.safecircle.dto.EmergencyContactResponseDTO;
import com.safecircle.dto.MedicalProfileDTO;
import com.safecircle.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MedicalProfileService medicalProfileService;
    private final EmergencyContactsService emergencyContactsService;
    private final FamilyMemberService familyMemberService;

    public DashboardResponseDTO getDashboardData(Long userId, User authenticatedUser) {
        MedicalProfileDTO medicalProfile = medicalProfileService.getMedicalProfile(userId)
                .orElse(new MedicalProfileDTO());

        List<EmergencyContactResponseDTO> contacts = emergencyContactsService.showContacts(userId);
        if (contacts == null) {
            contacts = Collections.emptyList();
        }

        int familyMembersCount = 0;
        try {
            familyMembersCount = familyMemberService.getFamilyMembers(userId).size();
        } catch (Exception e) {
            // Ignore if error getting family members
        }

        // Calculate Completion
        int personalInfoScore = (medicalProfile.getDob() != null ? 50 : 0) + (medicalProfile.getGender() != null ? 50 : 0);
        int medicalInfoScore = (medicalProfile.getBloodGroup() != null ? 33 : 0) + (medicalProfile.getHeight() != null ? 33 : 0) + (medicalProfile.getWeight() != null ? 34 : 0);
        int emergencyNotesScore = (medicalProfile.getEmergencyNotes() != null && !medicalProfile.getEmergencyNotes().isEmpty()) ? 100 : 0;
        int insuranceScore = (medicalProfile.getInsuranceProvider() != null && !medicalProfile.getInsuranceProvider().isEmpty()) ? 100 : 0;
        int doctorScore = (medicalProfile.getPrimaryDoctor() != null && !medicalProfile.getPrimaryDoctor().isEmpty()) ? 100 : 0;

        List<DashboardResponseDTO.SectionProgressDTO> sections = new ArrayList<>();
        sections.add(new DashboardResponseDTO.SectionProgressDTO("Personal info", personalInfoScore));
        sections.add(new DashboardResponseDTO.SectionProgressDTO("Medical info", medicalInfoScore));
        sections.add(new DashboardResponseDTO.SectionProgressDTO("Emergency notes", emergencyNotesScore));
        sections.add(new DashboardResponseDTO.SectionProgressDTO("Insurance", insuranceScore));
        sections.add(new DashboardResponseDTO.SectionProgressDTO("Doctor info", doctorScore));

        int totalCompletion = (personalInfoScore + medicalInfoScore + emergencyNotesScore + insuranceScore + doctorScore) / 5;

        // Mock stats and charts
        DashboardResponseDTO.StatsDTO stats = DashboardResponseDTO.StatsDTO.builder()
                .qrScans(new DashboardResponseDTO.StatDetail(32, "+12% this month", "up"))
                .emergencyAlerts(new DashboardResponseDTO.StatDetail(1, "Last: 5 days ago", "neutral"))
                .savedContacts(new DashboardResponseDTO.StatDetail(contacts.size(), contacts.size() + " total", "neutral"))
                .familyMembers(new DashboardResponseDTO.StatDetail(familyMembersCount, "All active", "up"))
                .build();

        DashboardResponseDTO.QrCodeStatusDTO qrCodeStatus = DashboardResponseDTO.QrCodeStatusDTO.builder()
                .active(true)
                .lastGenerated("3 days ago")
                .totalScans(32)
                .build();

        List<DashboardResponseDTO.ChartDataPointDTO> qrScanData = List.of(
                new DashboardResponseDTO.ChartDataPointDTO("Jan", 12, 0),
                new DashboardResponseDTO.ChartDataPointDTO("Feb", 19, 0),
                new DashboardResponseDTO.ChartDataPointDTO("Mar", 15, 0),
                new DashboardResponseDTO.ChartDataPointDTO("Apr", 28, 0),
                new DashboardResponseDTO.ChartDataPointDTO("May", 24, 0),
                new DashboardResponseDTO.ChartDataPointDTO("Jun", 32, 0)
        );

        List<DashboardResponseDTO.ChartDataPointDTO> emergencyData = List.of(
                new DashboardResponseDTO.ChartDataPointDTO("Jan", 0, 0),
                new DashboardResponseDTO.ChartDataPointDTO("Feb", 0, 1),
                new DashboardResponseDTO.ChartDataPointDTO("Mar", 0, 0),
                new DashboardResponseDTO.ChartDataPointDTO("Apr", 0, 2),
                new DashboardResponseDTO.ChartDataPointDTO("May", 0, 1),
                new DashboardResponseDTO.ChartDataPointDTO("Jun", 0, 0)
        );

        List<DashboardResponseDTO.RecentScanDTO> recentScans = List.of(
                new DashboardResponseDTO.RecentScanDTO(1L, "City General Hospital", "2 hours ago", "Medical scan"),
                new DashboardResponseDTO.RecentScanDTO(2L, "Airport Security", "Yesterday", "Profile view"),
                new DashboardResponseDTO.RecentScanDTO(3L, "Metro Station Kiosk", "3 days ago", "QR scan")
        );

        List<DashboardResponseDTO.RecentActivityDTO> recentActivity = List.of(
                new DashboardResponseDTO.RecentActivityDTO(1L, "Circle notified", "David Jenkins alerted", "5 days ago", "BellRing"),
                new DashboardResponseDTO.RecentActivityDTO(2L, "Profile updated", "Added penicillin allergy", "1 week ago", "HeartPulse"),
                new DashboardResponseDTO.RecentActivityDTO(3L, "New contact added", "Dr. Emily Chen", "2 weeks ago", "UserPlus")
        );

        return DashboardResponseDTO.builder()
                .userId(authenticatedUser != null ? authenticatedUser.getId() : userId)
                .fullName(authenticatedUser != null ? authenticatedUser.getFullName() : null)
                .email(authenticatedUser != null ? authenticatedUser.getEmail() : null)
                .medicalProfile(medicalProfile)
                .emergencyContacts(contacts)
                .completionPercentage(totalCompletion)
                .stats(stats)
                .qrCodeStatus(qrCodeStatus)
                .medicalProfileCompletion(sections)
                .qrScanData(qrScanData)
                .emergencyData(emergencyData)
                .recentScans(recentScans)
                .recentActivity(recentActivity)
                .build();
    }
}

