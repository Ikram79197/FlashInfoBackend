package com.flashinfo.entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "users", schema = "dbo")
public class FlashUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    // Comma-separated roles, e.g. ROLE_USER,ROLE_ADMIN
    private String roles;

    public FlashUser() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRoles() { return roles; }
    public void setRoles(String roles) { this.roles = roles; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FlashUser flashUser = (FlashUser) o;
        return Objects.equals(id, flashUser.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
