package com.flashinfo.dbconfig;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableJpaRepositories(
    basePackages = "com.flashinfo.user.repository", // Only FlashUserRepository
    entityManagerFactoryRef = "usersEntityManagerFactory",
    transactionManagerRef = "usersTransactionManager"
)
public class UsersDataSourceConfig {


    @Bean
    @ConfigurationProperties("spring.datasource.users")
    public DataSourceProperties usersDataSourceProperties() {
        return new DataSourceProperties();
    }


    @Bean(name = "usersDataSource")
    public DataSource usersDataSource() {
        return usersDataSourceProperties().initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }


        @Bean(name = "usersEntityManagerFactory")
        public LocalContainerEntityManagerFactoryBean usersEntityManagerFactory(
            EntityManagerFactoryBuilder builder) {
        Map<String, Object> jpaProperties = new HashMap<>();
        jpaProperties.put("hibernate.hbm2ddl.auto", "update");

        return builder
            .dataSource(usersDataSource())
            .packages("com.flashinfo.user.entity")
            .persistenceUnit("users")
            .properties(jpaProperties)
            .build();
        }


    @Bean(name = "usersTransactionManager")
    public PlatformTransactionManager usersTransactionManager(
            final @Qualifier("usersEntityManagerFactory") LocalContainerEntityManagerFactoryBean usersEntityManagerFactory) {
        return new JpaTransactionManager(usersEntityManagerFactory.getObject());
    }
}