package com.safecircle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationResponseDTO {
    private Long id;
    private Long userId;
    private String fullName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private LocalDateTime updatedAt;
}
