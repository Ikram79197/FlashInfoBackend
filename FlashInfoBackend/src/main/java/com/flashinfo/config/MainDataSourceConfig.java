package com.flashinfo.config;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class MainDataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(MainDataSourceConfig.class);

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties mainDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "dataSource")
    @Primary
    public DataSource dataSource() {
        DataSourceProperties props = mainDataSourceProperties();
        log.info("Initializing main datasource for URL={}", props.getUrl());
        HikariDataSource ds = props.initializeDataSourceBuilder().type(HikariDataSource.class).build();
        return ds;
    }
}
