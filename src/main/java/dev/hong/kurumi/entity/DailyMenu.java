package dev.hong.kurumi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_menu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;       // 날짜별 메뉴 (예: 2025-10-28)

    @Column(nullable = false)
    private String name;          // 오늘의 메뉴 이름

    @Column(nullable = false)
    private int price;            // 가격

    @Column(length = 500)
    private String description;   // 설명

    @Column
    private String imageUrl;      // 이미지 경로

}
