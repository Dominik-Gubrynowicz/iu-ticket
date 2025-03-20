package com.gubrynowicz.iuticket.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow credentials
        config.setAllowCredentials(true);

        // Allow requests from any localhost origin
        config.addAllowedOriginPattern("http://localhost:*");

        // If you have a specific frontend URL, include it explicitly
         config.addAllowedOrigin("http://localhost:5173");

        // Allow common headers
        config.addAllowedHeader("*");

        // Allow all methods
        config.addAllowedMethod("*");

        // Allow specific headers that might be needed for JWT auth
        config.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Methods",
                "Access-Control-Allow-Headers"
        ));

        // Set max age for preflight requests
        config.setMaxAge(3600L);

        source.registerCorsConfiguration("/api/**", config);
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}