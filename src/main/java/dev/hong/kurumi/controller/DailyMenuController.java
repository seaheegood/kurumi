package dev.hong.kurumi.controller;

import dev.hong.kurumi.entity.DailyMenu;
import dev.hong.kurumi.service.DailyMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/daily-menu")
@RequiredArgsConstructor
public class DailyMenuController {

    private final DailyMenuService dailyMenuService;

    // ✅ 오늘의 메뉴 전체 조회 (손님)
    @GetMapping
    public ResponseEntity<List<DailyMenu>> getTodayMenus() {
        List<DailyMenu> menus = dailyMenuService.getTodayMenus();
        return ResponseEntity.ok(menus);
    }

    // ✅ 특정 날짜 메뉴 전체 조회 (관리자)
    @GetMapping("/admin/{date}")
    public ResponseEntity<List<DailyMenu>> getMenusByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(dailyMenuService.getMenusByDate(localDate));
    }

    // ✅ 오늘의 메뉴 추가 (관리자)
    @PostMapping("/admin")
    public ResponseEntity<DailyMenu> createDailyMenu(@RequestBody DailyMenu menu) {
        return ResponseEntity.ok(dailyMenuService.createDailyMenu(menu));
    }

    // ✅ 메뉴 삭제 (관리자)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteDailyMenu(@PathVariable Long id) {
        dailyMenuService.deleteDailyMenu(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ 메뉴 템플릿 목록 조회 (관리자) - 이전에 등록한 메뉴들
    @GetMapping("/admin/templates")
    public ResponseEntity<List<DailyMenu>> getMenuTemplates() {
        return ResponseEntity.ok(dailyMenuService.getMenuTemplates());
    }

    // ✅ 메뉴 수정 (관리자) - 이미지 변경 시 기존 파일 삭제
    @PutMapping("/admin/{id}")
    public ResponseEntity<DailyMenu> updateDailyMenu(@PathVariable Long id, @RequestBody DailyMenu menu) {
        return ResponseEntity.ok(dailyMenuService.updateDailyMenu(id, menu));
    }
}
