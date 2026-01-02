package com.flashinfo.dto;

import lombok.Data;

@Data
public class OtpGenererRequestModel {
    private String systemName;
    private UserOtpData createUserRequestModel;
}
