package com.flashinfo.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flashinfo.dto.FlashInfoUserRequestModel;
import com.flashinfo.service.FlashInfoUserService;
import com.flashinfo.user.entity.FlashUser;
import com.flashinfo.user.repository.FlashUserRepository;

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
                .username(userRequestModel.getUsername())
                .password(hashedPassword)
                .roles(userRequestModel.getRoles())
                .userEmail(userRequestModel.getUserEmail())
                .phoneNumber(userRequestModel.getPhoneNumber())
                .build();
        return flashUserRepository.save(user);
    }
    
}
