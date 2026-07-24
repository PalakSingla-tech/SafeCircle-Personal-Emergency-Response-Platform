package com.safecircle.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_contacts")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class EmergencyContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String contactName;

    @Column(nullable = false)
    private String phoneNumber;

    private String relationship;

    @Column(nullable = false)
    @Builder.Default
    private Integer priorityOrder = 1;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
