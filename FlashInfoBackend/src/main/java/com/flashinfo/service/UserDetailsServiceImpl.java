package com.flashinfo.service;

import com.flashinfo.entity.FlashUser;
import com.flashinfo.repository.FlashUserRepository;
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
    private final FlashUserRepository userRepository;

    public UserDetailsServiceImpl(FlashUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        FlashUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                getAuthorities(user)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(FlashUser user) {
        // Parse comma-separated roles string and map to SimpleGrantedAuthority
        String rolesStr = user.getRoles();
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
