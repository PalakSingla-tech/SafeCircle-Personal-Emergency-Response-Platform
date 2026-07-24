package com.safecircle.repository;

import com.safecircle.entity.Location;
import com.safecircle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByUser(User user);
}
