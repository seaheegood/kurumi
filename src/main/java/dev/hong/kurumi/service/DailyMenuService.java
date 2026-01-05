package dev.hong.kurumi.service;

import dev.hong.kurumi.entity.DailyMenu;
import dev.hong.kurumi.repository.DailyMenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DailyMenuService {

    private final DailyMenuRepository dailyMenuRepository;
    private final FileStorageService fileStorageService;

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

    // 메뉴 템플릿 목록 조회 (이전에 등록한 메뉴들, 중복 제거)
    public List<DailyMenu> getMenuTemplates() {
        return dailyMenuRepository.findDistinctMenuTemplates();
    }

    // 오늘의 메뉴 수정 (이미지 변경 시 기존 파일 삭제)
    public DailyMenu updateDailyMenu(Long id, DailyMenu updatedMenu) {
        return dailyMenuRepository.findById(id)
                .map(menu -> {
                    // 이미지가 변경되었으면 기존 파일 삭제
                    String oldImageUrl = menu.getImageUrl();
                    String newImageUrl = updatedMenu.getImageUrl();
                    if (oldImageUrl != null && !oldImageUrl.equals(newImageUrl)) {
                        fileStorageService.deleteFile(oldImageUrl);
                    }

                    menu.setName(updatedMenu.getName());
                    menu.setPrice(updatedMenu.getPrice());
                    menu.setDescription(updatedMenu.getDescription());
                    menu.setImageUrl(newImageUrl);
                    return dailyMenuRepository.save(menu);
                })
                .orElseThrow(() -> new RuntimeException("Menu not found"));
    }

    // ID로 메뉴 조회
    public Optional<DailyMenu> getMenuById(Long id) {
        return dailyMenuRepository.findById(id);
    }
}
