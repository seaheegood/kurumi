package dev.hong.kurumi.service;

import dev.hong.kurumi.entity.DailyMenu;
import dev.hong.kurumi.repository.DailyMenuRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class DailyMenuServiceTest {

    @Autowired
    private DailyMenuService dailyMenuService;

    @Autowired
    private DailyMenuRepository dailyMenuRepository;

    @BeforeEach
    void setUp() {
        dailyMenuRepository.deleteAll();
    }

    @Test
    @DisplayName("오늘 날짜의 메뉴를 조회한다")
    void getTodayMenus_withTodayMenu() {
        // given
        LocalDate today = LocalDate.now();
        DailyMenu menu1 = DailyMenu.builder()
                .date(today)
                .name("오늘의 사시미")
                .price(35000)
                .description("신선한 제철 회")
                .build();
        DailyMenu menu2 = DailyMenu.builder()
                .date(today)
                .name("오늘의 튀김")
                .price(18000)
                .description("바삭한 모둠 튀김")
                .build();
        dailyMenuRepository.save(menu1);
        dailyMenuRepository.save(menu2);

        // when
        List<DailyMenu> result = dailyMenuService.getTodayMenus();

        // then
        assertThat(result).hasSize(2);
        assertThat(result).extracting("name")
                .containsExactlyInAnyOrder("오늘의 사시미", "오늘의 튀김");
    }

    @Test
    @DisplayName("오늘 메뉴가 없으면 가장 최근 메뉴를 반환한다")
    void getTodayMenus_withNoTodayMenu_returnsLatestMenu() {
        // given
        LocalDate yesterday = LocalDate.now().minusDays(1);
        LocalDate twoDaysAgo = LocalDate.now().minusDays(2);

        DailyMenu oldMenu = DailyMenu.builder()
                .date(twoDaysAgo)
                .name("이틀 전 메뉴")
                .price(20000)
                .build();
        DailyMenu yesterdayMenu = DailyMenu.builder()
                .date(yesterday)
                .name("어제의 메뉴")
                .price(25000)
                .build();
        dailyMenuRepository.save(oldMenu);
        dailyMenuRepository.save(yesterdayMenu);

        // when
        List<DailyMenu> result = dailyMenuService.getTodayMenus();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("어제의 메뉴");
        assertThat(result.get(0).getDate()).isEqualTo(yesterday);
    }

    @Test
    @DisplayName("메뉴가 전혀 없으면 빈 리스트를 반환한다")
    void getTodayMenus_withNoMenu_returnsEmptyList() {
        // when
        List<DailyMenu> result = dailyMenuService.getTodayMenus();

        // then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("특정 날짜의 메뉴를 조회한다")
    void getMenusByDate() {
        // given
        LocalDate targetDate = LocalDate.of(2025, 12, 25);
        DailyMenu menu = DailyMenu.builder()
                .date(targetDate)
                .name("크리스마스 특선")
                .price(50000)
                .description("특별한 크리스마스 메뉴")
                .build();
        dailyMenuRepository.save(menu);

        // when
        List<DailyMenu> result = dailyMenuService.getMenusByDate(targetDate);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("크리스마스 특선");
    }

    @Test
    @DisplayName("오늘의 메뉴를 생성한다")
    void createDailyMenu() {
        // given
        DailyMenu menu = DailyMenu.builder()
                .date(LocalDate.now())
                .name("새로운 메뉴")
                .price(30000)
                .description("맛있는 새 메뉴")
                .imageUrl("/uploads/test.jpg")
                .build();

        // when
        DailyMenu saved = dailyMenuService.createDailyMenu(menu);

        // then
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("새로운 메뉴");
        assertThat(saved.getPrice()).isEqualTo(30000);
    }

    @Test
    @DisplayName("오늘의 메뉴를 삭제한다")
    void deleteDailyMenu() {
        // given
        DailyMenu menu = DailyMenu.builder()
                .date(LocalDate.now())
                .name("삭제할 메뉴")
                .price(15000)
                .build();
        DailyMenu saved = dailyMenuRepository.save(menu);

        // when
        dailyMenuService.deleteDailyMenu(saved.getId());

        // then
        assertThat(dailyMenuRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    @DisplayName("여러 날짜 중 가장 최근 날짜의 메뉴만 반환한다")
    void getTodayMenus_returnsOnlyLatestDateMenus() {
        // given
        LocalDate threeDaysAgo = LocalDate.now().minusDays(3);
        LocalDate twoDaysAgo = LocalDate.now().minusDays(2);

        DailyMenu oldMenu1 = DailyMenu.builder()
                .date(threeDaysAgo)
                .name("3일 전 메뉴1")
                .price(10000)
                .build();
        DailyMenu oldMenu2 = DailyMenu.builder()
                .date(threeDaysAgo)
                .name("3일 전 메뉴2")
                .price(12000)
                .build();
        DailyMenu recentMenu1 = DailyMenu.builder()
                .date(twoDaysAgo)
                .name("2일 전 메뉴1")
                .price(20000)
                .build();
        DailyMenu recentMenu2 = DailyMenu.builder()
                .date(twoDaysAgo)
                .name("2일 전 메뉴2")
                .price(22000)
                .build();

        dailyMenuRepository.save(oldMenu1);
        dailyMenuRepository.save(oldMenu2);
        dailyMenuRepository.save(recentMenu1);
        dailyMenuRepository.save(recentMenu2);

        // when
        List<DailyMenu> result = dailyMenuService.getTodayMenus();

        // then
        assertThat(result).hasSize(2);
        assertThat(result).allMatch(m -> m.getDate().equals(twoDaysAgo));
        assertThat(result).extracting("name")
                .containsExactlyInAnyOrder("2일 전 메뉴1", "2일 전 메뉴2");
    }
}
