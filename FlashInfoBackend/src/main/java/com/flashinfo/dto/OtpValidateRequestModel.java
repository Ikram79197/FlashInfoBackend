package com.flashinfo.dto;

import lombok.Data;

@Data
public class OtpValidateRequestModel {
    String userLogin;
    String systemName;
    String codeValue;
}
