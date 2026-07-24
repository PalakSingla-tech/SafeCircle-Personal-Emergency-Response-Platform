package com.safecircle.service;

import com.safecircle.dto.MedicalProfileDTO;
import com.safecircle.entity.MedicalProfile;
import com.safecircle.entity.User;
import com.safecircle.mapper.MedicalProfileMapper;
import com.safecircle.repository.MedicalProfileRepository;
import com.safecircle.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MedicalProfileServiceTest {

    @Mock
    private MedicalProfileRepository medicalProfileRepository;

    @Mock
    private MedicalProfileMapper medicalProfileMapper;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private MedicalProfileService medicalProfileService;

    @Test
    void createMedicalProfileShouldAttachAuthenticatedUserToProfile() {
        User user = new User();
        user.setId(42L);

        MedicalProfileDTO dto = new MedicalProfileDTO();
        MedicalProfile profile = new MedicalProfile();

        when(userRepository.findById(42L)).thenReturn(Optional.of(user));
        when(medicalProfileMapper.toEntity(dto)).thenReturn(profile);

        String response = medicalProfileService.createMedicalProfile(42L, dto);

        assertEquals("Medical Profile created successfully", response);
        assertSame(user, profile.getUser());
        verify(medicalProfileRepository).save(profile);
    }
}
