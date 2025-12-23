package com.flashinfo.repository;

import com.flashinfo.entity.FlashUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FlashUserRepository extends JpaRepository<FlashUser, Long> {
    Optional<FlashUser> findByUsername(String username);
}
