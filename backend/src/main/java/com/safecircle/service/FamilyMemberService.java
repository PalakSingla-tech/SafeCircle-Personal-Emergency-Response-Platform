package com.safecircle.service;

import com.safecircle.dto.FamilyMemberRequestDTO;
import com.safecircle.dto.FamilyMemberResponseDTO;
import com.safecircle.entity.FamilyMember;
import com.safecircle.entity.User;
import com.safecircle.mapper.FamilyMemberMapper;
import com.safecircle.repository.FamilyMemberRepository;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FamilyMemberService {

    private final FamilyMemberRepository familyMemberRepository;
    private final UserRepository userRepository;
    private final FamilyMemberMapper familyMemberMapper;

    @Transactional
    public FamilyMemberResponseDTO addFamilyMember(Long userId, FamilyMemberRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User memberUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User with email " + request.getEmail() + " not found"));

        if (user.getId().equals(memberUser.getId())) {
            throw new RuntimeException("Cannot add yourself as a family member");
        }

        Optional<FamilyMember> existing = familyMemberRepository.findByUserAndMemberUser(user, memberUser);
        if (existing.isPresent()) {
            throw new RuntimeException("Family member already added");
        }

        FamilyMember familyMember = FamilyMember.builder()
                .user(user)
                .memberUser(memberUser)
                .relationship(request.getRelationship())
                .accessStatus(request.getAccessStatus() != null ? request.getAccessStatus() : "Emergency Only")
                .build();

        FamilyMember saved = familyMemberRepository.save(familyMember);
        return familyMemberMapper.mapToDTO(saved);
    }

    public List<FamilyMemberResponseDTO> getFamilyMembers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return familyMemberRepository.findByUser(user).stream()
                .map(familyMemberMapper::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FamilyMemberResponseDTO updateFamilyMember(Long userId, Long familyMemberId, FamilyMemberRequestDTO request) {
        FamilyMember familyMember = familyMemberRepository.findById(familyMemberId)
                .orElseThrow(() -> new RuntimeException("Family member not found"));

        if (!familyMember.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        familyMember.setRelationship(request.getRelationship());
        if (request.getAccessStatus() != null) {
            familyMember.setAccessStatus(request.getAccessStatus());
        }

        FamilyMember updated = familyMemberRepository.save(familyMember);
        return familyMemberMapper.mapToDTO(updated);
    }

    @Transactional
    public void removeFamilyMember(Long userId, Long familyMemberId) {
        FamilyMember familyMember = familyMemberRepository.findById(familyMemberId)
                .orElseThrow(() -> new RuntimeException("Family member not found"));

        if (!familyMember.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        familyMemberRepository.delete(familyMember);
    }
}
