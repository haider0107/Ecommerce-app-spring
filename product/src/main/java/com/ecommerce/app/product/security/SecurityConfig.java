package com.ecommerce.app.product.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(grantedAuthoritiesExtractor()))
                );

        return http.build();
    }

    private Converter<Jwt, AbstractAuthenticationToken> grantedAuthoritiesExtractor() {

        JwtAuthenticationConverter jwtAuthenticationConverter =
                new JwtAuthenticationConverter();

        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {

            Map<String, Object> resourceAccess = jwt.getClaim("resource_access");

            if (resourceAccess == null || !resourceAccess.containsKey("oauth2-pkce")) {
                return List.of();
            }

            Map<String, Object> clientRoles =
                    (Map<String, Object>) resourceAccess.get("oauth2-pkce");

            List<String> roles =
                    (List<String>) clientRoles.get("roles");

            if (roles == null) {
                return List.of();
            }

            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
        });

        return jwtAuthenticationConverter;
    }

//    private Converter<Jwt, AbstractAuthenticationToken> grantedAuthoritiesExtractor() {
//        JwtAuthenticationConverter jwtAuthenticationConverter =
//                new JwtAuthenticationConverter();
//        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
//            List<String> roles = jwt.getClaimAsMap("resource_access")
//                    .entrySet().stream()
//                    .filter(entry -> entry.getKey().equals("oauth2-pkce"))
//                    .flatMap(entry -> ((Map<String, List<String>>) entry.getValue())
//                            .get("roles").stream())
//                    .toList();
//
//            return roles.stream()
//                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role));
//
//        });
//        return jwtAuthenticationConverter;
//    }
}
