package com.flashinfo.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flashinfo.dto.OtpValidateRequestModel;
import com.flashinfo.security.SecurityConstants;
import com.flashinfo.service.FlashInfoUserService;
import com.flashinfo.service.Impl.OtpServiceImpl;
import com.flashinfo.user.entity.FlashUser;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("api/public/otp")
public class OtpController {

    @Autowired
    public OtpServiceImpl otpService;

    @Autowired
    public FlashInfoUserService userService;

    @PostMapping
    public ResponseEntity<?> validateOtp(@RequestBody OtpValidateRequestModel requestModel,
            HttpServletResponse response) {
        try {
            ResponseEntity<String> otpResponse = otpService.validateOtp(requestModel);
            if (!otpResponse.getStatusCode().is2xxSuccessful()) {
                if (otpResponse.getStatusCode() == HttpStatus.GONE) {
                    return ResponseEntity.status(HttpStatus.GONE).body(java.util.Map.of("error", "Code Expiré"));
                }
                if (otpResponse.getStatusCode() == HttpStatus.BAD_REQUEST) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(java.util.Map.of("error", "Code invalide"));
                }
                return ResponseEntity.status(otpResponse.getStatusCode())
                        .body(java.util.Map.of("error", "Erreur lors de la validation de l'OTP."));
            } else {
                String userLogin = requestModel.getUserLogin();
                FlashUser user;
                try {
                    user = userService.getUserByUserName(userLogin);
                    if (user == null) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(java.util.Map.of("error", "Utilisateur introuvable"));
                    }
                } catch (RuntimeException ex) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(java.util.Map.of("error", "Utilisateur introuvable"));
                }
                    // Si l'utilisateur est 'admin', on le passe en trusted_device=1
                    if ("admin".equalsIgnoreCase(user.getUserName())) {
                        user.setTrustedDevice(true);
                        userService.saveUser(user);
                    }
                String token = Jwts.builder()
                        .setSubject(user.getUserEmail())
                        .setExpiration(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                        .signWith(SecurityConstants.SECRET_KEY, SignatureAlgorithm.HS512)
                        .compact();
                response.addHeader(SecurityConstants.HEADER_STRING, SecurityConstants.TOKEN_PREFIX + token);
                // Retourner un vrai JSON
                return ResponseEntity.ok(
                    java.util.Map.of(
                        "message", "OTP validé avec succès",
                        "token", SecurityConstants.TOKEN_PREFIX + token
                    )
                );
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
