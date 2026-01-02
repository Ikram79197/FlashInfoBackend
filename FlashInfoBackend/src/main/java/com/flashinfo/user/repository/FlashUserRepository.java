package com.flashinfo.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.flashinfo.user.entity.FlashUser;

import java.util.Optional;

@Repository
public interface FlashUserRepository extends JpaRepository<FlashUser, Long> {
    Optional<FlashUser> findByUserEmail(String userEmail);

    @Query("SELECT u FROM FlashUser u WHERE LOWER(u.userName) = LOWER(:username)")
    Optional<FlashUser> findByUserNameIgnoreCaseCustom(@Param("username") String username);
}
