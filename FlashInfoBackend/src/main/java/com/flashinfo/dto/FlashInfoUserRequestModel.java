package com.flashinfo.dto;


import com.flashinfo.util.RoleEnum;

import lombok.Data;

@Data
public class FlashInfoUserRequestModel {

    private String username;
    private String password;
    private String userEmail;
    private String phoneNumber;
    private RoleEnum roles;
    
}
