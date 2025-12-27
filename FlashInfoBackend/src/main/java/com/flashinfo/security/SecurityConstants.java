package com.flashinfo.security;

import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Base64;

public class SecurityConstants {

    public static final String SECRET_BASE64 = "wK1vQ2p3s5v8x/A+Qw1v8Qw2v9Qw3v0Qw4v1Qw5v2Qw6v3Qw7v4Qw8v5Qw9v6Qw0v7Qw1v8Qw2v9Qw3v0Qw4v1Qw5v2Qw6v3Qw7v4Qw8v5Qw9v6Qw0v7Qw==";
    public static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_BASE64));
    public static final long EXPIRATION_TIME = 864_000_000; // 10 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/users/sign-up";
}
