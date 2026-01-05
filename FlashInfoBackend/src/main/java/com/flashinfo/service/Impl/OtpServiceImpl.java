package com.flashinfo.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.flashinfo.dto.OtpGenererRequestModel;
import com.flashinfo.dto.OtpValidateRequestModel;
import com.flashinfo.security.SecurityConstants;
import com.flashinfo.util.OtpUtilitis;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class OtpServiceImpl {

    private static final Logger log = LoggerFactory.getLogger(OtpServiceImpl.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    Environment env;

    //private final String otpServiceUrl = "https://otp.mamda-mcma.ma/otpservice/api";
    //private final String otpServiceUrl = "http://localhost:8084/api";

    public ResponseEntity<String> generateOtp(OtpGenererRequestModel requestModel, String authorizationHeader) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authorizationHeader);
            headers.set("Content-Type", "application/json"); // Ensure JSON is sent

            HttpEntity<OtpGenererRequestModel> entity = new HttpEntity<>(requestModel, headers);
            System.out.println("Sending OTP generation request to: " + env.getProperty("otp.otpServiceURL.service") + "/gererOtp");
            return restTemplate.postForEntity(env.getProperty("otp.otpServiceURL.service") + "/gererOtp", entity, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de la génération de l'OTP: " + e.getMessage());
        }
    }

    public ResponseEntity<String> validateOtp(OtpValidateRequestModel requestModel) {

        String payload =  requestModel.getUserLogin() + requestModel.getCodeValue() + requestModel.getSystemName();
        String token = OtpUtilitis.generateToken(payload, env.getProperty("otp.secretToken.service"));

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            headers.set("Content-Type", "application/json");
        
            HttpEntity<OtpValidateRequestModel> entity = new HttpEntity<>(requestModel, headers);
            return restTemplate.postForEntity(env.getProperty("otp.otpServiceURL.service") + "/validateOtp", entity, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de la validation de l'OTP: " + e.getMessage());
        }
    }
}


