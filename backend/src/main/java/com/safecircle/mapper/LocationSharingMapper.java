package com.safecircle.mapper;

import com.safecircle.dto.LocationResponseDTO;
import com.safecircle.entity.Location;
import org.springframework.stereotype.Component;

@Component
public class LocationSharingMapper {
    public LocationResponseDTO mapToDTO(Location location) {
        return LocationResponseDTO.builder()
                .id(location.getId())
                .userId(location.getUser().getId())
                .fullName(location.getUser().getFullName())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .updatedAt(location.getUpdatedAt())
                .build();
    }
}
