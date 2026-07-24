package com.safecircle.repository;

import com.safecircle.entity.FamilyMember;
import com.safecircle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
    List<FamilyMember> findByUser(User user);
    Optional<FamilyMember> findByUserAndMemberUser(User user, User memberUser);
    List<FamilyMember> findByMemberUser(User memberUser);
}
