package com.safecircle.service;

import com.safecircle.dto.SettingsPasswordRequestDTO;
import com.safecircle.dto.SettingsProfileRequestDTO;
import com.safecircle.dto.SettingsDTO;
import com.safecircle.entity.User;
import com.safecircle.entity.UserSettings;
import com.safecircle.repository.UserRepository;
import com.safecircle.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void updateProfile(Long userId, SettingsProfileRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(user);
    }

    @Transactional
    public void updatePassword(Long userId, SettingsPasswordRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public SettingsDTO getUserSettings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserSettings defaultSettings = UserSettings.builder()
                            .user(user)
                            .emailNotifications(true)
                            .smsNotifications(false)
                            .twoFactor(false)
                            .language("en")
                            .darkMode(false)
                            .locationSharingEnabled(true)
                            .emergencyAutoShare(true)
                            .build();
                    return userSettingsRepository.save(defaultSettings);
                });

        return SettingsDTO.builder()
                .emailNotifications(settings.isEmailNotifications())
                .smsNotifications(settings.isSmsNotifications())
                .twoFactor(settings.isTwoFactor())
                .language(settings.getLanguage())
                .darkMode(settings.isDarkMode())
                .locationSharingEnabled(settings.isLocationSharingEnabled())
                .emergencyAutoShare(settings.isEmergencyAutoShare())
                .build();
    }

    @Transactional
    public SettingsDTO updateUserSettings(Long userId, SettingsDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> UserSettings.builder().user(user).build());

        settings.setEmailNotifications(request.isEmailNotifications());
        settings.setSmsNotifications(request.isSmsNotifications());
        settings.setTwoFactor(request.isTwoFactor());
        settings.setLanguage(request.getLanguage());
        settings.setDarkMode(request.isDarkMode());
        settings.setLocationSharingEnabled(request.isLocationSharingEnabled());
        settings.setEmergencyAutoShare(request.isEmergencyAutoShare());

        userSettingsRepository.save(settings);

        return request;
    }
}
