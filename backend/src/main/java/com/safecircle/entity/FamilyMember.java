package com.safecircle.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "family_members", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "member_user_id" })
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class FamilyMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "member_user_id", nullable = false)
    private User memberUser;

    @Column(nullable = false)
    private String relationship;

    @Column(nullable = false)
    @Builder.Default
    private String accessStatus = "Emergency Only";

    @CreationTimestamp
    private LocalDateTime createdAt;
}
