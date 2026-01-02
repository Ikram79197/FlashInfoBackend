package com.flashinfo.dbconfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class TrustedDeviceColumnInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            // Vérifie si la colonne existe déjà (compatible H2, MySQL, SQL Server)
            String checkColumn = "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'trusted_device'";
            Integer exists = jdbcTemplate.query(checkColumn, rs -> rs.next() ? 1 : 0);
            if (exists == null || exists == 0) {
                jdbcTemplate.execute("ALTER TABLE users ADD trusted_device BOOLEAN DEFAULT 0");
                System.out.println("Colonne trusted_device ajoutée à la table users.");
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de l'ajout de la colonne trusted_device : " + e.getMessage());
        }
    }
}
