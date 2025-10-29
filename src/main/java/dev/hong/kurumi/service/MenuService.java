package dev.hong.kurumi.service;

import dev.hong.kurumi.entity.Menu;
import dev.hong.kurumi.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    public Optional<Menu> getMenuById(Long id) {
        return menuRepository.findById(id);
    }

    public Menu createMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    public Menu updateMenu(Long id, Menu updatedMenu) {
        return menuRepository.findById(id)
                .map(menu -> {
                    menu.setName(updatedMenu.getName());
                    menu.setPrice(updatedMenu.getPrice());
                    menu.setDescription(updatedMenu.getDescription());
                    menu.setImageUrl(updatedMenu.getImageUrl());
                    return menuRepository.save(menu);
                })
                .orElseThrow(() -> new RuntimeException("Menu not found"));
    }

    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
}
