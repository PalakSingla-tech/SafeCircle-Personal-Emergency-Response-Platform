package com.safecircle.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_profiles")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MedicalProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private LocalDate dob;
    private String gender;
    private String bloodGroup;
    private String height;
    private String weight;

    @Column(columnDefinition = "TEXT")
    private String medicalConditions;

    @Column(columnDefinition = "TEXT")
    private String currentMedications;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(columnDefinition = "TEXT")
    private String pastSurgeries;

    @Column(columnDefinition = "TEXT")
    private String disabilities;

    private String organDonor;

    @Column(columnDefinition = "TEXT")
    private String emergencyNotes;

    private String insuranceProvider;
    private String policyNumber;

    private String primaryDoctor;
    private String hospitalPreference;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
