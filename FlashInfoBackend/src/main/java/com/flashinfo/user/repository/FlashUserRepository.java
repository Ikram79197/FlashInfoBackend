package com.flashinfo.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flashinfo.user.entity.FlashUser;

import java.util.Optional;

@Repository
public interface FlashUserRepository extends JpaRepository<FlashUser, Long> {
    Optional<FlashUser> findByUserEmail(String userEmail);
}
