package dev.hong.kurumi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notice")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;          // 제목

    @Column(nullable = false, length = 2000)
    private String content;        // 내용

    @Column(nullable = false)
    private LocalDateTime createdAt; // 작성일시
}