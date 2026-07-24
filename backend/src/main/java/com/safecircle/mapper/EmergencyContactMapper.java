package com.safecircle.mapper;

import com.safecircle.dto.EmergencyContactRequestDTO;
import com.safecircle.dto.EmergencyContactResponseDTO;
import com.safecircle.entity.EmergencyContact;
import org.springframework.stereotype.Component;

@Component
public class EmergencyContactMapper {
    public EmergencyContact toEntity(EmergencyContactRequestDTO dto)
    {
        return EmergencyContact.builder()
                .contactName(dto.getContactName())
                .phoneNumber(dto.getPhoneNumber())
                .relationship(dto.getRelationship())
                .build();
    }

    public EmergencyContactResponseDTO toResponseDTO(EmergencyContact emergencyContact)
    {
        return EmergencyContactResponseDTO.builder()
                .id(emergencyContact.getId())
                .contactName(emergencyContact.getContactName())
                .phoneNumber(emergencyContact.getPhoneNumber())
                .relationship(emergencyContact.getRelationship())
                .priorityOrder(emergencyContact.getPriorityOrder())
                .build();
    }
}
