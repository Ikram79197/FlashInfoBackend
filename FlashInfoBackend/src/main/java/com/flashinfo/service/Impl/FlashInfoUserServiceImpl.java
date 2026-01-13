package com.flashinfo.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flashinfo.dto.FlashInfoUserRequestModel;
import com.flashinfo.service.FlashInfoUserService;
import com.flashinfo.user.entity.FlashUser;
import com.flashinfo.user.repository.FlashUserRepository;

import java.time.LocalDateTime;

@Service
public class FlashInfoUserServiceImpl implements FlashInfoUserService{


    @Autowired
    FlashUserRepository flashUserRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public FlashUser addFlashInfoUser(FlashInfoUserRequestModel userRequestModel) {

        // Check if user with the same email already exists
        if (flashUserRepository.findByUserEmail(userRequestModel.getUserEmail()).isPresent()) {
            throw new IllegalArgumentException("User already exists with this email.");
        }

        String hashedPassword = passwordEncoder.encode(userRequestModel.getPassword());
        FlashUser user = FlashUser.builder()
                .userName(userRequestModel.getUsername())
                .password(hashedPassword)
                .roles(userRequestModel.getRoles())
                .userEmail(userRequestModel.getUserEmail())
                .phoneNumber(userRequestModel.getPhoneNumber())
                .build();
        return flashUserRepository.save(user);
    }

    @Override
    public FlashUser getUserActive(String userLogin) {
        return flashUserRepository.findByUserEmail(userLogin)
                .orElseThrow(() -> new RuntimeException("User not found or inactive"));
    }

    @Override
    public FlashUser getUserByUserName(String userName) {
        return flashUserRepository.findByUserNameIgnoreCaseCustom(userName)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public FlashUser saveUser(FlashUser user) {
        return flashUserRepository.save(user);
    }

    @Override
    public FlashUser updatePassword(String userLogin, String newPassword) {
        FlashUser user = flashUserRepository.findByUserNameIgnoreCaseCustom(userLogin) // Utilisez une méthode adaptée pour rechercher par userLogin
                .orElseThrow(() -> new RuntimeException("User not found"));

        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        user.setPasswordChanged(true); // Set passwordChanged to 1
        user.setPasswordChangeDate(LocalDateTime.now()); // Set the current date and time
        return flashUserRepository.save(user);
    }
}
