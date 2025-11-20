package com.rr.respawnReviews.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.rr.respawnReviews.service.UserDetailsServiceImpl;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authProvider) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .cors(Customizer.withDefaults())
            .headers(headers -> headers.frameOptions(frame -> frame.disable())) 
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos
                .requestMatchers("/error").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()

                //Auth
                .requestMatchers("/api/auth/**").permitAll()
                
                //Post
                .requestMatchers(HttpMethod.GET,"/api/posts/*").permitAll()
                .requestMatchers(HttpMethod.GET,"/api/posts/*/*").permitAll()
                .requestMatchers(HttpMethod.GET,"/api/posts/user/*").permitAll()

                //Comments
                .requestMatchers(HttpMethod.GET,"/api/comment/**").permitAll()

                //Rating
                .requestMatchers(HttpMethod.GET,"/api/rating/game/*").permitAll()

                //User
                .requestMatchers(HttpMethod.GET,"/api/users/**").permitAll()


                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/api/comment/**").permitAll()

     
                // Endpoints privados

                //Post
                .requestMatchers(HttpMethod.POST,"/api/posts").hasRole("USER")

                //comments
                .requestMatchers(HttpMethod.POST,"/api/comment/**").hasRole("USER")

                //Rating
                .requestMatchers(HttpMethod.POST,"/api/rating/**").hasRole("USER")
                .requestMatchers(HttpMethod.GET,"/api/rating/gameuser/*").hasRole("USER")

                //User
                .requestMatchers(HttpMethod.PATCH,"/api/users/**").hasRole("USER")

                .anyRequest().authenticated()
            )
            .authenticationProvider(authProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); 

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsServiceImpl userDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
