package com.safecircle.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.safecircle.entity.User;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicalProfileDTO {
    @JsonIgnore
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
}
