package dev.hong.kurumi.service;

import dev.hong.kurumi.entity.DailyMenu;
import dev.hong.kurumi.repository.DailyMenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DailyMenuService {

    private final DailyMenuRepository dailyMenuRepository;

    public Optional<DailyMenu> getTodayMenu() {
        return dailyMenuRepository.findByDate(LocalDate.now());
    }

    public DailyMenu getMenuByDate(LocalDate date) {
        return dailyMenuRepository.findByDate(date)
                .orElseThrow(() -> new RuntimeException("No Menu for given date: " + date.toString().replace("-", ".")));
    }

    public DailyMenu createOrUpdateDailyMenu(DailyMenu menu) {
        return dailyMenuRepository.save(menu);
    }

    public void deleteDailyMenu(Long id) {
        dailyMenuRepository.deleteById(id);
    }
}
