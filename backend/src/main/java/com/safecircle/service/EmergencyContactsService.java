package com.safecircle.service;

import com.safecircle.dto.EmergencyContactRequestDTO;
import com.safecircle.dto.EmergencyContactResponseDTO;
import com.safecircle.entity.EmergencyContact;
import com.safecircle.entity.User;
import com.safecircle.mapper.EmergencyContactMapper;
import com.safecircle.repository.EmergencyContactRepository;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyContactsService {

    private final UserRepository userRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final EmergencyContactMapper emergencyContactMapper;

    public EmergencyContactResponseDTO addContact(Long id, EmergencyContactRequestDTO emergencyContactRequestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EmergencyContact ec = emergencyContactMapper.toEntity(emergencyContactRequestDTO);
        ec.setUser(user);
        EmergencyContact saved = emergencyContactRepository.save(ec);
        return emergencyContactMapper.toResponseDTO(saved);
    }

    public List<EmergencyContactResponseDTO> showContacts(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<EmergencyContact> contactList = emergencyContactRepository.findByUser(user);
        return contactList.stream()
                .map(emergencyContactMapper::toResponseDTO)
                .toList();
    }

    public EmergencyContactResponseDTO updateContact(Long userId, Long contactId, EmergencyContactRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        EmergencyContact contact = emergencyContactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        contact.setContactName(dto.getContactName());
        contact.setRelationship(dto.getRelationship());
        contact.setPhoneNumber(dto.getPhoneNumber());
        
        EmergencyContact saved = emergencyContactRepository.save(contact);
        return emergencyContactMapper.toResponseDTO(saved);
    }

    public String deleteContact(Long userId, Long contactId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        EmergencyContact contact = emergencyContactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        emergencyContactRepository.delete(contact);
        return "Contact deleted successfully";
    }
}
