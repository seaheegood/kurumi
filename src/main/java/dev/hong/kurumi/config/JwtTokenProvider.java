package dev.hong.kurumi.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final String SECRET_KEY = "kurumi_secret_key_kurumi_secret_key_kurumi_secret_key";
    // ✅ 운영에서는 반드시 더 길고 복잡한 key 사용 (최소 32바이트 이상)
    private final long EXPIRATION = 1000L * 60 * 60; // 1시간

    private final UserDetailsService userDetailsService; // ✅ 추가됨

    // ✅ 생성자 주입
    public JwtTokenProvider(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    // ✅ 서명 키 생성
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    // ✅ 토큰 생성
    public String generateToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + EXPIRATION);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // ✅ 토큰에서 username 추출
    public String getUsername(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (JwtException e) {
            return null;
        }
    }

    // ✅ 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ✅ Authentication 객체 생성 (UserService 의존 제거)
    public Authentication getAuthentication(String token) {
        String username = getUsername(token);
        if (username == null) return null;

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );
    }
}