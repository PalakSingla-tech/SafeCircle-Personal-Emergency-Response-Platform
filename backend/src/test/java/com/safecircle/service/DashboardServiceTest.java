package com.safecircle.service;

import com.safecircle.dto.DashboardResponseDTO;
import com.safecircle.dto.EmergencyContactResponseDTO;
import com.safecircle.dto.MedicalProfileDTO;
import com.safecircle.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private MedicalProfileService medicalProfileService;

    @Mock
    private EmergencyContactsService emergencyContactsService;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void shouldBuildDashboardSummaryForAuthenticatedUser() {
        User user = new User();
        user.setId(7L);
        user.setFullName("Alice Johnson");

        MedicalProfileDTO medicalProfile = new MedicalProfileDTO();
        medicalProfile.setBloodGroup("O+");

        EmergencyContactResponseDTO contact = new EmergencyContactResponseDTO();
        contact.setContactName("Mom");

        when(medicalProfileService.getMedicalProfile(7L)).thenReturn(Optional.of(medicalProfile));
        when(emergencyContactsService.showContacts(7L)).thenReturn(List.of(contact));

        DashboardResponseDTO dashboard = dashboardService.getDashboardData(7L, user);

        assertEquals("Alice Johnson", dashboard.getFullName());
        assertEquals("O+", dashboard.getMedicalProfile().getBloodGroup());
        assertEquals(1, dashboard.getEmergencyContacts().size());
    }
}
