package com.safecircle.service;

import com.safecircle.dto.LocationRequestDTO;
import com.safecircle.dto.LocationResponseDTO;
import com.safecircle.entity.FamilyMember;
import com.safecircle.entity.Location;
import com.safecircle.entity.User;
import com.safecircle.mapper.LocationSharingMapper;
import com.safecircle.repository.LocationRepository;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LocationSharingService {

    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final com.safecircle.repository.FamilyMemberRepository familyMemberRepository;
    private final LocationSharingMapper locationSharingMapper;

    @Transactional
    public LocationResponseDTO updateLocation(Long userId, LocationRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Location location;
        if (request.getAlertId() != null) {
            Optional<Location> existingLocation = locationRepository.findByAlertId(request.getAlertId());
            if (existingLocation.isPresent()) {
                location = existingLocation.get();
                location.setLatitude(request.getLatitude());
                location.setLongitude(request.getLongitude());
            } else {
                location = Location.builder()
                        .user(user)
                        .alertId(request.getAlertId())
                        .latitude(request.getLatitude())
                        .longitude(request.getLongitude())
                        .build();
            }
        } else {
            Optional<Location> existingLocation = locationRepository.findFirstByUserOrderByIdDesc(user);
            if (existingLocation.isPresent()) {
                location = existingLocation.get();
                location.setLatitude(request.getLatitude());
                location.setLongitude(request.getLongitude());
            } else {
                location = Location.builder()
                        .user(user)
                        .latitude(request.getLatitude())
                        .longitude(request.getLongitude())
                        .build();
            }
        }

        Location saved = locationRepository.save(location);
        return locationSharingMapper.mapToDTO(saved);
    }

    public LocationResponseDTO getLocation(Long alertId) {
        Location location = locationRepository.findByAlertId(alertId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Location not found"));

        return locationSharingMapper.mapToDTO(location);
    }

    public List<LocationResponseDTO> getSharedLocations(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FamilyMember> circlesImIn = familyMemberRepository.findByMemberUser(currentUser);
        List<LocationResponseDTO> sharedLocations = new ArrayList<>();

        for (FamilyMember fm : circlesImIn) {
            // Find latest location of fm.getUser()
            User sharingUser = fm.getUser();
            Optional<Location> latestLocation = locationRepository.findFirstByUserOrderByIdDesc(sharingUser);
            
            if (latestLocation.isPresent()) {
                Location loc = latestLocation.get();
                LocationResponseDTO dto = locationSharingMapper.mapToDTO(loc);
                dto.setUserId(sharingUser.getId());
                dto.setFullName(sharingUser.getFullName());
                sharedLocations.add(dto);
            }
        }
        return sharedLocations;
    }
}
