package com.sliit.bookingmodule.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Slf4j
@Configuration
@EnableMongoRepositories(basePackages = "com.sliit.bookingmodule.repository")
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    public MongoConfig() {
        log.info("=====================================");
        log.info("MongoDB Configuration Initialized");
        log.info("Using: MongoDB Atlas (cluster0.nqbxzln.mongodb.net)");
        log.info("Database: booking_db");
        log.info("=====================================");
    }

    @Bean
    public MongoClient mongoClient() {
        log.info("Creating MongoClient with URI: {}", mongoUri);
        return MongoClients.create(mongoUri);
    }
}
