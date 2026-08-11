package com.safecircle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingsDTO {
    private boolean emailNotifications;
    private boolean smsNotifications;
    private boolean twoFactor;
    private String language;
    private boolean darkMode;
    private boolean locationSharingEnabled;
    private boolean emergencyAutoShare;
}
