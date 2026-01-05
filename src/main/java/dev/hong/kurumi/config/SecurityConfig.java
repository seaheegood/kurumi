package dev.hong.kurumi.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 정적 리소스 허용 (React SPA)
                        .requestMatchers("/", "/index.html", "/static/**", "/assets/**").permitAll()
                        .requestMatchers("/*.js", "/*.css", "/*.ico", "/*.png", "/*.svg", "/*.json").permitAll()
                        // 업로드된 이미지 허용
                        .requestMatchers("/uploads/**").permitAll()
                        // H2 콘솔 (테스트용)
                        .requestMatchers("/h2-console/**").permitAll()
                        // 인증 API
                        .requestMatchers("/api/auth/**").permitAll()
                        // 메뉴 조회 (공개)
                        .requestMatchers(HttpMethod.GET, "/api/menus").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/menus/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/daily-menu").permitAll()
                        // 공지사항 조회 (공개)
                        .requestMatchers(HttpMethod.GET, "/api/notices").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/notices/{id}").permitAll()
                        // 관리자 전용 API
                        .requestMatchers("/api/menus/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/daily-menu/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/notices/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/upload/**").hasRole("ADMIN")
                        // 나머지는 인증 필요
                        .anyRequest().authenticated()
                )
                .headers(headers -> headers.frameOptions(frame -> frame.disable())) // H2 콘솔용
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
