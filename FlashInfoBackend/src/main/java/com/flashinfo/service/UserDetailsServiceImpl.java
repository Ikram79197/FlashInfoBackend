package com.flashinfo.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.flashinfo.user.entity.FlashUser;
import com.flashinfo.user.repository.FlashUserRepository;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
        private static final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    private final FlashUserRepository userRepository;

    public UserDetailsServiceImpl(FlashUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Attempting to load user: {}", username);
        FlashUser user = userRepository.findByUserEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        log.info("Loaded user from DB: username={}, password={}, roles={}",
            user.getUserName(), user.getPassword(), user.getRoles());
        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getPassword(),
                getAuthorities(user)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(FlashUser user) {
        // Parse comma-separated roles string and map to SimpleGrantedAuthority
        String rolesStr = user.getRoles().name();
        if (rolesStr == null || rolesStr.isEmpty()) {
            return List.of();
        }
        return List.of(rolesStr.split(","))
            .stream()
            .map(String::trim)
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
    }
}
