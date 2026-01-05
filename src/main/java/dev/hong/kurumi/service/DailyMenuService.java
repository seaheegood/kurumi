package dev.hong.kurumi.service;

import dev.hong.kurumi.entity.DailyMenu;
import dev.hong.kurumi.repository.DailyMenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyMenuService {

    private final DailyMenuRepository dailyMenuRepository;

    // 오늘의 메뉴 전체 조회 (오늘 날짜에 메뉴가 없으면 가장 최근 메뉴 반환)
    public List<DailyMenu> getTodayMenus() {
        LocalDate today = LocalDate.now();
        List<DailyMenu> todayMenus = dailyMenuRepository.findByDateOrderByIdDesc(today);

        // 오늘 날짜에 메뉴가 없으면 가장 최근 메뉴 반환
        if (todayMenus.isEmpty()) {
            return dailyMenuRepository.findLatestMenusUpToDate(today);
        }
        return todayMenus;
    }

    // 특정 날짜 메뉴 전체 조회
    public List<DailyMenu> getMenusByDate(LocalDate date) {
        return dailyMenuRepository.findByDateOrderByIdDesc(date);
    }

    // 오늘의 메뉴 추가
    public DailyMenu createDailyMenu(DailyMenu menu) {
        return dailyMenuRepository.save(menu);
    }

    // 오늘의 메뉴 삭제
    public void deleteDailyMenu(Long id) {
        dailyMenuRepository.deleteById(id);
    }
}
