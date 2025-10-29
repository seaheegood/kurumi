package dev.hong.kurumi.controller;


import dev.hong.kurumi.entity.Reservation;
import dev.hong.kurumi.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // ✅ 예약 생성 (손님)
    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.createReservation(reservation));
    }

    // ✅ 특정 날짜 예약 조회 (관리자)
    @GetMapping("/admin/{date}")
    public ResponseEntity<List<Reservation>> getReservationsByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(reservationService.getReservationsByDate(localDate));
    }

    // ✅ 전체 예약 조회 (관리자)
    @GetMapping("/admin")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    // ✅ 예약 삭제 (관리자)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
