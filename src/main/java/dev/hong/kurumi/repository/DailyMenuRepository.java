package dev.hong.kurumi.repository;

import dev.hong.kurumi.entity.DailyMenu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DailyMenuRepository extends JpaRepository<DailyMenu, Long> {
    List<DailyMenu> findByDate(LocalDate date);
    List<DailyMenu> findByDateOrderByIdDesc(LocalDate date);
}
