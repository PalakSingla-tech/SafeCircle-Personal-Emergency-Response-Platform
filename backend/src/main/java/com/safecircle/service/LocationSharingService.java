package com.safecircle.service;

import com.safecircle.dto.LocationRequestDTO;
import com.safecircle.dto.LocationResponseDTO;
import com.safecircle.entity.Location;
import com.safecircle.entity.User;
import com.safecircle.mapper.LocationSharingMapper;
import com.safecircle.repository.LocationRepository;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LocationSharingService {

    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final LocationSharingMapper locationSharingMapper;

    @Transactional
    public LocationResponseDTO updateLocation(Long userId, LocationRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Location> existingLocation = locationRepository.findByUser(user);
        Location location;

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

        Location saved = locationRepository.save(location);
        return locationSharingMapper.mapToDTO(saved);
    }

    public LocationResponseDTO getLocation(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Location location = locationRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        return locationSharingMapper.mapToDTO(location);
    }
}
