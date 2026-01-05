package dev.hong.kurumi.repository;

import dev.hong.kurumi.entity.DailyMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyMenuRepository extends JpaRepository<DailyMenu, Long> {
    List<DailyMenu> findByDate(LocalDate date);
    List<DailyMenu> findByDateOrderByIdDesc(LocalDate date);

    // 가장 최근 날짜 조회
    @Query("SELECT MAX(d.date) FROM DailyMenu d")
    Optional<LocalDate> findLatestDate();

    // 특정 날짜 이하에서 가장 최근 날짜의 메뉴 조회
    @Query("SELECT d FROM DailyMenu d WHERE d.date = (SELECT MAX(d2.date) FROM DailyMenu d2 WHERE d2.date <= :date) ORDER BY d.id DESC")
    List<DailyMenu> findLatestMenusUpToDate(LocalDate date);

    // 고유한 메뉴 템플릿 목록 조회 (이름 기준 중복 제거, 최신순)
    @Query("SELECT d FROM DailyMenu d WHERE d.id IN (SELECT MAX(d2.id) FROM DailyMenu d2 GROUP BY d2.name) ORDER BY d.id DESC")
    List<DailyMenu> findDistinctMenuTemplates();
}
