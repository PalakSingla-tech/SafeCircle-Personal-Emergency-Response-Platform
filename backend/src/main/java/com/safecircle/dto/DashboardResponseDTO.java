package com.safecircle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardResponseDTO {
    private Long userId;
    private String fullName;
    private String email;
    private MedicalProfileDTO medicalProfile;
    private List<EmergencyContactResponseDTO> emergencyContacts;

    // New fields for frontend dashboard
    private int completionPercentage;
    
    private StatsDTO stats;
    private QrCodeStatusDTO qrCodeStatus;
    private List<SectionProgressDTO> medicalProfileCompletion;
    
    private List<ChartDataPointDTO> qrScanData;
    private List<ChartDataPointDTO> emergencyData;
    private List<RecentScanDTO> recentScans;
    private List<RecentActivityDTO> recentActivity;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class StatsDTO {
        private StatDetail qrScans;
        private StatDetail emergencyAlerts;
        private StatDetail savedContacts;
        private StatDetail familyMembers;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class StatDetail {
        private int value;
        private String change;
        private String trend; // "up", "down", "neutral"
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class QrCodeStatusDTO {
        private boolean active;
        private String lastGenerated;
        private int totalScans;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SectionProgressDTO {
        private String label;
        private int value;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ChartDataPointDTO {
        private String month;
        private int scans; // or alerts
        private int alerts;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RecentScanDTO {
        private Long id;
        private String location;
        private String time;
        private String type;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RecentActivityDTO {
        private Long id;
        private String title;
        private String desc;
        private String time;
        private String icon; // string representation of the icon name
    }
}
