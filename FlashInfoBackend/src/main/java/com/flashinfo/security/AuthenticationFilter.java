package com.flashinfo.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flashinfo.dto.OtpGenererRequestModel;
import com.flashinfo.dto.UserOtpData;
import com.flashinfo.service.FlashInfoUserService;
import com.flashinfo.service.Impl.OtpServiceImpl;
import com.flashinfo.user.entity.FlashUser;
import com.flashinfo.util.OtpUtilitis;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;

@Slf4j
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final Environment env;
    private final FlashInfoUserService userService;
    private final OtpServiceImpl otpService;

    public AuthenticationFilter(
        AuthenticationManager authenticationManager,
        Environment env,
        FlashInfoUserService userService,
        OtpServiceImpl otpService
    ) {
        super.setAuthenticationManager(authenticationManager);
        // Accept login requests sent to /api/login (frontend uses /api prefix)
        super.setFilterProcessesUrl(SecurityConstants.LOGIN_URL);
        this.env = env;
        this.userService = userService;
        this.otpService = otpService;
    }


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            com.flashinfo.dto.LoginRequest creds = new ObjectMapper().readValue(request.getInputStream(), com.flashinfo.dto.LoginRequest.class);
            System.out.println("Login attempt: " + creds.getUsername() + " / " + creds.getPassword()); // Debug only
            return getAuthenticationManager().authenticate(
                new UsernamePasswordAuthenticationToken(
                    creds.getUsername(),
                    creds.getPassword(),
                    new ArrayList<>()
                )
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {

        String username = ((User) authResult.getPrincipal()).getUsername();
        log.info("User '{}' authenticated successfully.", username);
        FlashUser user = userService.getUserByUserName(username);

        // Bypass OTP for admin@mail.com if trustedDevice is true
        if (user.getUserEmail() != null && user.getUserEmail().equalsIgnoreCase("admin@mail.com") && Boolean.TRUE.equals(user.getTrustedDevice())) {
            String token = Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .signWith(SecurityConstants.SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
            response.addHeader(SecurityConstants.HEADER_STRING, SecurityConstants.TOKEN_PREFIX + token);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.addHeader("userEmail", username);
            String json = "{\"token\": \"" + SecurityConstants.TOKEN_PREFIX + token + "\", \"username\": \"" + username + "\"}";
            response.getWriter().write(json);
            return;
        }

        if (env.getProperty("otpBypass").equals("false")) {
            OtpGenererRequestModel otpRequest = new OtpGenererRequestModel();
            UserOtpData userOtpData = new UserOtpData();
            String systemName = "FlashInfo";
            String userLogin = user.getUserName();
            String userEmail = user.getUserEmail() != null ? user.getUserEmail() : "";
            String phoneNumber = user.getPhoneNumber() != null ? user.getPhoneNumber() : "";
            otpRequest.setSystemName(systemName);
            userOtpData.setUserLogin(userLogin);
            userOtpData.setUserEmail(userEmail);
            userOtpData.setPhoneNumber(phoneNumber);

            otpRequest.setCreateUserRequestModel(userOtpData);
            String payload = userLogin + userEmail + phoneNumber + systemName;
            log.info("payload for OTP token: {}", payload);
            String token = OtpUtilitis.generateToken(payload, env.getProperty("otp.secretToken.service"));
            try {
                ResponseEntity<String> otpResponse = otpService.generateOtp(otpRequest, "Bearer " + token);
                log.info("OTP generation response: {}", otpResponse.getBody());
                if (!otpResponse.getStatusCode().is2xxSuccessful()) {
                    response.setStatus(otpResponse.getStatusCodeValue());
                    response.setContentType("application/json");
                    response.getWriter().write("Erreur lors de la génération de l'OTP.");
                    return;
                }
                // If OTP is successful, continue with your normal flow (e.g. send JWT, etc.)
            } catch (Exception e) {
                log.error("Erreur lors de l'appel à l'API OTP: {}", e.getMessage());
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                response.getWriter().write("Erreur lors de la génération de l'OTP.");
                return;
            }
        } else {
            String token = Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .signWith(SecurityConstants.SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
            response.addHeader(SecurityConstants.HEADER_STRING, SecurityConstants.TOKEN_PREFIX + token);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.addHeader("userEmail", username);
            // Ajout du username dans la réponse JSON pour le front
            String json = "{\"token\": \"" + SecurityConstants.TOKEN_PREFIX + token + "\", \"username\": \"" + username + "\"}";
            response.getWriter().write(json);
        }


        // String token = Jwts.builder()
        //     .setSubject(username)
        //     .setExpiration(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
        //     .signWith(SecurityConstants.SECRET_KEY, SignatureAlgorithm.HS512)
        //     .compact();
        // response.addHeader(SecurityConstants.HEADER_STRING, SecurityConstants.TOKEN_PREFIX + token);
        // response.setContentType("application/json");
        // response.setCharacterEncoding("UTF-8");
        // String json = "{\"token\": \"" + SecurityConstants.TOKEN_PREFIX + token + "\"}";
        // response.getWriter().write(json);
    }
}
