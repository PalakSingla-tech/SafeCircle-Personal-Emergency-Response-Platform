package com.safecircle.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationRequestDTO {
    
    @NotNull(message = "Latitude is required")
    private BigDecimal latitude;
    
    @NotNull(message = "Longitude is required")
    private BigDecimal longitude;
}
