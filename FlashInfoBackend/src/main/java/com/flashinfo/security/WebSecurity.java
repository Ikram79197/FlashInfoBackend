package com.flashinfo.security;


import com.flashinfo.service.UserDetailsServiceImpl;
import com.flashinfo.service.Impl.OtpServiceImpl;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.core.env.Environment;
import com.flashinfo.service.FlashInfoUserService;

@Configuration
@EnableWebSecurity
public class WebSecurity {
    private final UserDetailsServiceImpl userDetailsService;

    public WebSecurity(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(
        HttpSecurity http,
        AuthenticationManager authenticationManager,
        Environment env,
        FlashInfoUserService userService,
        OtpServiceImpl otpService
    ) throws Exception {
        http.cors().and().csrf().disable()
            .authorizeHttpRequests(authz -> authz
                // Allow sign-up and the login processing URL through without authentication
                .requestMatchers(SecurityConstants.SIGN_UP_URL, SecurityConstants.LOGIN_URL,"/api/public/otp").permitAll()
                .anyRequest().authenticated()
            )
            .addFilter(authenticationFilter(authenticationManager, env, userService, otpService))
            .addFilter(new AuthorizationFilter(authenticationManager));
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
	public RestTemplate getRestTemplate() {
		return new RestTemplate();
	}

    @Bean
    public AuthenticationFilter authenticationFilter(
        AuthenticationManager authenticationManager,
        Environment env,
        FlashInfoUserService userService,
        OtpServiceImpl otpService
    ) {
        return new AuthenticationFilter(authenticationManager, env, userService, otpService);
    }
}
