package com.flashinfo.user.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;

import com.flashinfo.util.RoleEnum;

import lombok.*;

@Entity
@Table(name = "users", schema = "dbo")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlashUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    private String phoneNumber;

    @Column(nullable = false,unique = true)
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
        message = "Email must be a valid format"
    )
    private String userEmail;

    // Comma-separated roles, e.g. ROLE_USER,ROLE_ADMIN
    @Enumerated(EnumType.STRING)
    private RoleEnum roles;


}
