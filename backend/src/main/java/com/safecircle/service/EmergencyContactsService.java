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

    public String addContact(Long id, EmergencyContactRequestDTO emergencyContactRequestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EmergencyContact ec = emergencyContactMapper.toEntity(emergencyContactRequestDTO);
        ec.setUser(user);
        emergencyContactRepository.save(ec);
        return "Emergency Contact added successfully";
    }

    public List<EmergencyContactResponseDTO> showContacts(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<EmergencyContact> contactList = emergencyContactRepository.findByUser(user);
        return contactList.stream()
                .map(emergencyContactMapper::toResponseDTO)
                .toList();
    }
}
