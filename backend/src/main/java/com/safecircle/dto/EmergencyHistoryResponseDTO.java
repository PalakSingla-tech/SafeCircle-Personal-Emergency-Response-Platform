package com.safecircle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyHistoryResponseDTO {
    private String id;
    private String date;
    private String time;
    private String location;
    private String responder;
    private String hospital;
    private String type;
    private String status;
}
