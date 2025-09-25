package com.rustorder.api.order.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.rustorder.api.order.repository")
@EnableTransactionManagement
public class MysqlLink {
    
}
