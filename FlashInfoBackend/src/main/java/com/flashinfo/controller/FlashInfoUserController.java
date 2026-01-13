package com.flashinfo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import com.flashinfo.dto.FlashInfoUserRequestModel;
import com.flashinfo.service.FlashInfoUserService;
import com.flashinfo.user.entity.FlashUser;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class FlashInfoUserController {


    private final FlashInfoUserService flashInfoUserService;

    @PostMapping("/addFlashInfoUser")
    public ResponseEntity<FlashUser> addFlashInfoUser(@RequestBody FlashInfoUserRequestModel userRequestModel) {
        try {
            FlashUser createdUser = flashInfoUserService.addFlashInfoUser(userRequestModel);
            return ResponseEntity.ok(createdUser);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
       
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<FlashUser> updatePassword(@RequestBody Map<String, String> request) {
        try {
            String userLogin = request.get("userLogin");
            String newPassword = request.get("newPassword");
            FlashUser updatedUser = flashInfoUserService.updatePassword(userLogin, newPassword);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
