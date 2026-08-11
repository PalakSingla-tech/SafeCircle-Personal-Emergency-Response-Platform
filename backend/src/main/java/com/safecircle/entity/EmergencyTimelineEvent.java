package com.safecircle.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_timeline_events")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class EmergencyTimelineEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alert_id", nullable = false)
    private Long alertId;

    @Column(nullable = false)
    private String eventLabel;

    @CreationTimestamp
    private LocalDateTime eventTime;
}
