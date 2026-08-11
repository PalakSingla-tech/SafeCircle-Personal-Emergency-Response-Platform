package com.safecircle.service;

import com.safecircle.dto.DashboardResponseDTO;
import com.safecircle.dto.EmergencyContactResponseDTO;
import com.safecircle.dto.MedicalProfileDTO;
import com.safecircle.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

import com.safecircle.entity.EmergencyHistory;
import com.safecircle.entity.QrScan;
import com.safecircle.repository.EmergencyHistoryRepository;
import com.safecircle.repository.QrScanRepository;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MedicalProfileService medicalProfileService;
    private final EmergencyContactsService emergencyContactsService;
    private final FamilyMemberService familyMemberService;
    private final QrScanRepository qrScanRepository;
    private final EmergencyHistoryRepository emergencyHistoryRepository;

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
        int personalInfoScore = (medicalProfile.getDob() != null ? 50 : 0) + (medicalProfile.getGender() != null && !medicalProfile.getGender().isEmpty() ? 50 : 0);
        int medicalInfoScore = (medicalProfile.getBloodGroup() != null && !medicalProfile.getBloodGroup().isEmpty() ? 33 : 0) + (medicalProfile.getHeight() != null && !medicalProfile.getHeight().isEmpty() ? 33 : 0) + (medicalProfile.getWeight() != null && !medicalProfile.getWeight().isEmpty() ? 34 : 0);
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

        List<QrScan> allScans = qrScanRepository.findByUserIdOrderByTimestampDesc(userId);
        List<EmergencyHistory> allEmergencies = emergencyHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);

        // Stats calculation
        LocalDate now = LocalDate.now();
        int scansThisMonth = 0;
        for (QrScan s : allScans) {
            if (s.getTimestamp().getMonth() == now.getMonth() && s.getTimestamp().getYear() == now.getYear()) {
                scansThisMonth++;
            }
        }

        int alertsThisMonth = 0;
        for (EmergencyHistory e : allEmergencies) {
            if (e.getCreatedAt() != null && e.getCreatedAt().getMonth() == now.getMonth() && e.getCreatedAt().getYear() == now.getYear()) {
                alertsThisMonth++;
            } else if (e.getCreatedAt() == null) { // fallback
                alertsThisMonth++;
            }
        }

        DashboardResponseDTO.StatsDTO stats = DashboardResponseDTO.StatsDTO.builder()
                .qrScans(new DashboardResponseDTO.StatDetail(allScans.size(), scansThisMonth + " this month", scansThisMonth > 0 ? "up" : "neutral"))
                .emergencyAlerts(new DashboardResponseDTO.StatDetail(allEmergencies.size(), alertsThisMonth + " this month", alertsThisMonth > 0 ? "up" : "neutral"))
                .savedContacts(new DashboardResponseDTO.StatDetail(contacts.size(), contacts.size() + " total", "neutral"))
                .familyMembers(new DashboardResponseDTO.StatDetail(familyMembersCount, familyMembersCount + " total", "neutral"))
                .build();

        DashboardResponseDTO.QrCodeStatusDTO qrCodeStatus = DashboardResponseDTO.QrCodeStatusDTO.builder()
                .active(true)
                .lastGenerated(allScans.isEmpty() ? "Never" : "Active")
                .totalScans(allScans.size())
                .build();

        // Chart Data (Last 6 months)
        Map<String, DashboardResponseDTO.ChartDataPointDTO> chartMap = new LinkedHashMap<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM");
        for (int i = 5; i >= 0; i--) {
            String m = now.minusMonths(i).format(monthFormatter);
            chartMap.put(m, new DashboardResponseDTO.ChartDataPointDTO(m, 0, 0));
        }

        for (QrScan s : allScans) {
            if (s.getTimestamp().isAfter(now.minusMonths(6).atStartOfDay())) {
                String m = s.getTimestamp().format(monthFormatter);
                if (chartMap.containsKey(m)) {
                    chartMap.get(m).setScans(chartMap.get(m).getScans() + 1);
                }
            }
        }

        for (EmergencyHistory e : allEmergencies) {
            if (e.getCreatedAt() != null && e.getCreatedAt().isAfter(now.minusMonths(6).atStartOfDay())) {
                String m = e.getCreatedAt().format(monthFormatter);
                if (chartMap.containsKey(m)) {
                    chartMap.get(m).setAlerts(chartMap.get(m).getAlerts() + 1);
                }
            }
        }

        List<DashboardResponseDTO.ChartDataPointDTO> qrScanData = new ArrayList<>(chartMap.values());
        List<DashboardResponseDTO.ChartDataPointDTO> emergencyData = new ArrayList<>(chartMap.values());

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
        List<DashboardResponseDTO.RecentScanDTO> recentScans = allScans.stream().limit(5).map(s -> 
            DashboardResponseDTO.RecentScanDTO.builder()
                .id(s.getId())
                .location(s.getLocation())
                .time(s.getTimestamp().format(timeFormatter))
                .type(s.getDeviceType())
                .build()
        ).collect(Collectors.toList());

        List<DashboardResponseDTO.RecentActivityDTO> recentActivity = allEmergencies.stream().limit(5).map(e -> 
            DashboardResponseDTO.RecentActivityDTO.builder()
                .id(e.getId())
                .title(e.getType())
                .desc(e.getStatus())
                .time(e.getDate() + " " + e.getTime())
                .icon("alert")
                .build()
        ).collect(Collectors.toList());

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

