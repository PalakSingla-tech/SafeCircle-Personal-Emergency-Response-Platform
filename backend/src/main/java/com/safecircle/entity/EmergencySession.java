package com.safecircle.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_sessions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class EmergencySession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String responderName;
    private String responderPhone;
    private String destinationHospital;

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE";

    @CreationTimestamp
    private LocalDateTime startedAt;

    private LocalDateTime endedAt;
}
