package dev.hong.kurumi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;          // 예약자 이름

    @Column(nullable = false)
    private String phone;         // 연락처

    @Column(nullable = false)
    private int people;           // 인원 수

    @Column(nullable = false)
    private LocalDateTime reservationTime; // 예약 일시

    @Column(length = 500)
    private String note;          // 요청사항
}