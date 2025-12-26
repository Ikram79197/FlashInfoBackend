package com.flashinfo.config;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class UsersDataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(UsersDataSourceConfig.class);


    @Bean
    @ConfigurationProperties("datasource.users")
    public DataSourceProperties usersDataSourceProperties() {
        return new DataSourceProperties();
    }


    @Bean(name = "usersDataSource")
    public DataSource usersDataSource() {
        DataSourceProperties props = usersDataSourceProperties();
        log.info("Initializing users datasource for URL={}", props.getUrl());
        return props.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }


    @Bean(name = "usersJdbcTemplate")
    public JdbcTemplate usersJdbcTemplate() {
        return new JdbcTemplate(usersDataSource());
    }

    @Bean(name = "usersTransactionManager")
    public org.springframework.jdbc.datasource.DataSourceTransactionManager usersTransactionManager() {
        return new org.springframework.jdbc.datasource.DataSourceTransactionManager(usersDataSource());
    }
}
