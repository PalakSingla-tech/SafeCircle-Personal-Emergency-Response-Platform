package com.safecircle.mapper;

import com.safecircle.dto.FamilyMemberResponseDTO;
import com.safecircle.entity.FamilyMember;
import org.springframework.stereotype.Component;

@Component
public class FamilyMemberMapper {
    public FamilyMemberResponseDTO mapToDTO(FamilyMember familyMember) {
        return FamilyMemberResponseDTO.builder()
                .id(familyMember.getId())
                .memberId(familyMember.getMemberUser().getId())
                .fullName(familyMember.getMemberUser().getFullName())
                .email(familyMember.getMemberUser().getEmail())
                .phoneNumber(familyMember.getMemberUser().getPhoneNumber())
                .relationship(familyMember.getRelationship())
                .accessStatus(familyMember.getAccessStatus())
                .addedAt(familyMember.getCreatedAt())
                .build();
    }
}
