package dev.hong.kurumi.controller;

import dev.hong.kurumi.entity.DailyMenu;
import dev.hong.kurumi.service.DailyMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/daily-menu")
@RequiredArgsConstructor
public class DailyMenuController {

    private final DailyMenuService dailyMenuService;

    // ✅ 오늘의 메뉴 조회 (손님)
    @GetMapping
    public ResponseEntity<DailyMenu> getTodayMenu() {
        return dailyMenuService.getTodayMenu()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ 특정 날짜 메뉴 조회 (관리자)
    @GetMapping("/admin/{date}")
    public ResponseEntity<DailyMenu> getMenuByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(dailyMenuService.getMenuByDate(localDate));
    }

    // ✅ 오늘의 메뉴 등록/수정 (관리자)
    @PostMapping("/admin")
    public ResponseEntity<DailyMenu> createOrUpdateDailyMenu(@RequestBody DailyMenu menu) {
        return ResponseEntity.ok(dailyMenuService.createOrUpdateDailyMenu(menu));
    }

    // ✅ 메뉴 삭제 (관리자)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteDailyMenu(@PathVariable Long id) {
        dailyMenuService.deleteDailyMenu(id);
        return ResponseEntity.noContent().build();
    }
}
