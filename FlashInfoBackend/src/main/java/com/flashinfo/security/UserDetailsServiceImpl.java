package com.flashinfo.security;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final ApplicationContext ctx;
    private JdbcTemplate usersJdbcTemplate; // resolved lazily
    private static final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    public UserDetailsServiceImpl(ApplicationContext ctx) {
        this.ctx = ctx;
        try {
            this.usersJdbcTemplate = ctx.getBean("usersJdbcTemplate", JdbcTemplate.class);
        } catch (NoSuchBeanDefinitionException ex) {
            this.usersJdbcTemplate = null; // will be handled on first login attempt
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // ensure the users JdbcTemplate bean is available (resolve lazily)
        if (this.usersJdbcTemplate == null) {
            try {
                this.usersJdbcTemplate = ctx.getBean("usersJdbcTemplate", JdbcTemplate.class);
            } catch (NoSuchBeanDefinitionException ex) {
                log.error("usersJdbcTemplate bean not found - authentication datasource is not configured");
                throw new UsernameNotFoundException("Authentication datasource not configured");
            }
        }

        try {
            UserRecord rec = usersJdbcTemplate.queryForObject(
                    "SELECT username, password, roles FROM dbo.users WHERE username = ?",
                    new Object[]{username},
                    new RowMapper<UserRecord>() {
                        @Override
                        public UserRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
                            UserRecord r = new UserRecord();
                            r.username = rs.getString("username");
                            r.password = rs.getString("password");
                            r.roles = rs.getString("roles");
                            return r;
                        }
                    }
            );
            log.debug("Loaded user {} with hash {}", username, rec.password);

            Collection<GrantedAuthority> authorities = Arrays.stream(
                    rec.roles == null ? new String[0] : rec.roles.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            return new User(rec.username, rec.password, authorities);
        } catch (EmptyResultDataAccessException e) {
            log.warn("User {} not found in users DB", username);
            throw new UsernameNotFoundException("User not found");
        }
    }

    // simple holder for query results
    private static class UserRecord {
        String username;
        String password;
        String roles;
    }
}
