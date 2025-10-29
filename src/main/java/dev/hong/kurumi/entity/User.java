package dev.hong.kurumi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "user")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;   // 로그인 ID

    @Column(nullable = false)
    private String password;   // 비밀번호 (BCrypt 인코딩 예정)

    @Column(nullable = false)
    private String role;       // ROLE_ADMIN, ROLE_USER 등

    public <T> User(String username, String s, List<T> ts) {
    }
}