package com.flashinfo.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Simple utility to generate BCrypt password hashes.
 * Run with: mvn -q -Dexec.mainClass="com.flashinfo.util.PasswordHashGenerator" exec:java -Dexec.args="MyPlainPassword"
 */
public class PasswordHashGenerator {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.err.println("Usage: java PasswordHashGenerator <plain-password>");
            System.exit(2);
        }
        String plain = args[0];
        BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
        String hash = enc.encode(plain);
        System.out.println(hash);
    }
}
