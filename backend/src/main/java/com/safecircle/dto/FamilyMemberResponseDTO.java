package com.safecircle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMemberResponseDTO {
    private Long id;
    private Long memberId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String relationship;
    private String accessStatus;
    private LocalDateTime addedAt;
}
