package dev.hong.kurumi.service;

import dev.hong.kurumi.entity.Menu;
import dev.hong.kurumi.repository.MenuRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class MenuServiceTest {

    @Autowired
    private MenuService menuService;

    @Autowired
    private MenuRepository menuRepository;

    @BeforeEach
    void setUp() {
        menuRepository.deleteAll();
    }

    @Test
    @DisplayName("모든 메뉴를 조회한다")
    void getAllMenus() {
        // given
        Menu menu1 = Menu.builder()
                .name("모둠 사시미")
                .price(45000)
                .category("안주")
                .isAvailable(true)
                .build();
        Menu menu2 = Menu.builder()
                .name("사케")
                .price(15000)
                .category("주류")
                .isAvailable(true)
                .build();
        Menu menu3 = Menu.builder()
                .name("녹차")
                .price(5000)
                .category("음료")
                .isAvailable(true)
                .build();
        menuRepository.save(menu1);
        menuRepository.save(menu2);
        menuRepository.save(menu3);

        // when
        List<Menu> result = menuService.getAllMenus();

        // then
        assertThat(result).hasSize(3);
        assertThat(result).extracting("category")
                .containsExactlyInAnyOrder("안주", "주류", "음료");
    }

    @Test
    @DisplayName("ID로 메뉴를 조회한다")
    void getMenuById() {
        // given
        Menu menu = Menu.builder()
                .name("연어 사시미")
                .price(28000)
                .category("안주")
                .description("신선한 노르웨이산 연어")
                .isAvailable(true)
                .build();
        Menu saved = menuRepository.save(menu);

        // when
        Optional<Menu> result = menuService.getMenuById(saved.getMenuId());

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("연어 사시미");
        assertThat(result.get().getPrice()).isEqualTo(28000);
    }

    @Test
    @DisplayName("존재하지 않는 ID로 조회하면 빈 Optional을 반환한다")
    void getMenuById_notFound() {
        // when
        Optional<Menu> result = menuService.getMenuById(999L);

        // then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("새로운 메뉴를 생성한다")
    void createMenu() {
        // given
        Menu menu = Menu.builder()
                .name("광어 사시미")
                .price(35000)
                .category("안주")
                .description("쫄깃한 광어회")
                .imageUrl("/uploads/flatfish.jpg")
                .isAvailable(true)
                .build();

        // when
        Menu saved = menuService.createMenu(menu);

        // then
        assertThat(saved.getMenuId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("광어 사시미");
        assertThat(saved.getPrice()).isEqualTo(35000);
        assertThat(saved.getCategory()).isEqualTo("안주");
        assertThat(saved.getImageUrl()).isEqualTo("/uploads/flatfish.jpg");
    }

    @Test
    @DisplayName("메뉴를 수정한다")
    void updateMenu() {
        // given
        Menu menu = Menu.builder()
                .name("원래 이름")
                .price(10000)
                .category("안주")
                .isAvailable(true)
                .build();
        Menu saved = menuRepository.save(menu);

        Menu updateData = Menu.builder()
                .name("수정된 이름")
                .price(15000)
                .description("새로운 설명")
                .imageUrl("/uploads/new-image.jpg")
                .build();

        // when
        Menu updated = menuService.updateMenu(saved.getMenuId(), updateData);

        // then
        assertThat(updated.getName()).isEqualTo("수정된 이름");
        assertThat(updated.getPrice()).isEqualTo(15000);
        assertThat(updated.getDescription()).isEqualTo("새로운 설명");
        assertThat(updated.getImageUrl()).isEqualTo("/uploads/new-image.jpg");
    }

    @Test
    @DisplayName("존재하지 않는 메뉴 수정 시 예외가 발생한다")
    void updateMenu_notFound() {
        // given
        Menu updateData = Menu.builder()
                .name("수정할 메뉴")
                .price(20000)
                .build();

        // when & then
        assertThatThrownBy(() -> menuService.updateMenu(999L, updateData))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Menu not found");
    }

    @Test
    @DisplayName("메뉴를 삭제한다")
    void deleteMenu() {
        // given
        Menu menu = Menu.builder()
                .name("삭제할 메뉴")
                .price(12000)
                .category("안주")
                .isAvailable(true)
                .build();
        Menu saved = menuRepository.save(menu);

        // when
        menuService.deleteMenu(saved.getMenuId());

        // then
        assertThat(menuRepository.findById(saved.getMenuId())).isEmpty();
    }

    @Test
    @DisplayName("카테고리별 메뉴가 올바르게 저장된다")
    void createMenu_categories() {
        // given
        Menu anju = Menu.builder()
                .name("닭꼬치")
                .price(8000)
                .category("안주")
                .isAvailable(true)
                .build();
        Menu drink = Menu.builder()
                .name("아사히 생맥주")
                .price(7000)
                .category("주류")
                .isAvailable(true)
                .build();
        Menu beverage = Menu.builder()
                .name("우롱차")
                .price(4000)
                .category("음료")
                .isAvailable(true)
                .build();

        // when
        Menu savedAnju = menuService.createMenu(anju);
        Menu savedDrink = menuService.createMenu(drink);
        Menu savedBeverage = menuService.createMenu(beverage);

        // then
        assertThat(savedAnju.getCategory()).isEqualTo("안주");
        assertThat(savedDrink.getCategory()).isEqualTo("주류");
        assertThat(savedBeverage.getCategory()).isEqualTo("음료");
    }

    @Test
    @DisplayName("품절 상태의 메뉴를 생성한다")
    void createMenu_unavailable() {
        // given
        Menu menu = Menu.builder()
                .name("품절 메뉴")
                .price(30000)
                .category("안주")
                .isAvailable(false)
                .build();

        // when
        Menu saved = menuService.createMenu(menu);

        // then
        assertThat(saved.isAvailable()).isFalse();
    }

    @Test
    @DisplayName("이미지 URL이 없는 메뉴도 생성 가능하다")
    void createMenu_noImage() {
        // given
        Menu menu = Menu.builder()
                .name("이미지 없는 메뉴")
                .price(20000)
                .category("안주")
                .isAvailable(true)
                .build();

        // when
        Menu saved = menuService.createMenu(menu);

        // then
        assertThat(saved.getMenuId()).isNotNull();
        assertThat(saved.getImageUrl()).isNull();
    }
}
