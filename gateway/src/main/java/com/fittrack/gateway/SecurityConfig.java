package com.fittrack.gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // Enable CORS
                .cors(Customizer.withDefaults())

                .authorizeExchange(exchange -> exchange

                        // Allow browser CORS preflight requests
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Everything else requires authentication
                        .anyExchange().authenticated()
                )

                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(Customizer.withDefaults())
                )

                .build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Local + Production frontend
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "https://fittrack-frontend-pixv.onrender.com"
        ));

        // HTTP methods
        config.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        // Request headers
        config.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-User-ID"
        ));

        // Allow credentials
        config.setAllowCredentials(true);

        // Expose useful response headers
        config.setExposedHeaders(Arrays.asList(
                "Authorization"
        ));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        // Apply CORS configuration to API endpoints
        source.registerCorsConfiguration("/api/**", config);

        return source;
    }
}