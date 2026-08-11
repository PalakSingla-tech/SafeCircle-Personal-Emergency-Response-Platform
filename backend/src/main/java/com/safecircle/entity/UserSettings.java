package com.safecircle.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_settings")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean emailNotifications = true;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean smsNotifications = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean twoFactor = false;

    @Column(nullable = false)
    private String language = "en";

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean darkMode = false;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean locationSharingEnabled = true;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean emergencyAutoShare = true;
}
