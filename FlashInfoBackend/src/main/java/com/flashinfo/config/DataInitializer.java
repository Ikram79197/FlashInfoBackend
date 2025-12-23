package com.flashinfo.config;

import com.flashinfo.entity.FlashUser;
import com.flashinfo.repository.FlashUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DataInitializer {

    private final FlashUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${initial.admin.username:admin}")
    private String adminUsername;

    @Value("${initial.admin.password:admin123}")
    private String adminPassword;

    @Value("${initial.admin.enabled:false}")
    private boolean enabled;

    public DataInitializer(FlashUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void createInitialAdmin() {
        if (!enabled) {
            return; // initializer disabled, do nothing
        }
        // Create initial admin only if no users exist or admin username not present
        boolean any = userRepository.count() > 0;
        if (!any) {
            FlashUser admin = new FlashUser();
            admin.setUsername(adminUsername);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRoles("ROLE_ADMIN,ROLE_USER");
            userRepository.save(admin);
        } else {
            // If there is no user with adminUsername, optionally create it
            if (userRepository.findByUsername(adminUsername).isEmpty()) {
                FlashUser admin = new FlashUser();
                admin.setUsername(adminUsername);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRoles("ROLE_ADMIN,ROLE_USER");
                userRepository.save(admin);
            }
        }
    }
}
