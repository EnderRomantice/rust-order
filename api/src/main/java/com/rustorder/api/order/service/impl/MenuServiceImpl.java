package com.rustorder.api.order.service.impl;

import com.rustorder.api.order.model.Dish;
import com.rustorder.api.order.model.Menu;
import com.rustorder.api.order.repository.DishRepository;
import com.rustorder.api.order.repository.MenuRepository;
import com.rustorder.api.order.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MenuServiceImpl implements MenuService {
    
    private final MenuRepository menuRepository;
    private final DishRepository dishRepository;
    
    @Autowired
    public MenuServiceImpl(MenuRepository menuRepository, DishRepository dishRepository) {
        this.menuRepository = menuRepository;
        this.dishRepository = dishRepository;
    }
    
    @Override
    public List<Menu> getAvailableMenuItems() {
        // 从t_dish表中获取所有可用菜品
        List<Dish> dishes = dishRepository.findByIsAvailableOrderByDishTypeAscSortOrderAsc(true);
        return dishes.stream()
                .map(this::convertDishToMenu)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Menu> getAllMenuItems() {
        // 从t_dish表中获取所有菜品（包括已下架的，用于管理端）
        List<Dish> dishes = dishRepository.findAll();
        return dishes.stream()
                .map(this::convertDishToMenu)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Menu> getAvailableMenuItemsByType(String dishType) {
        // 从t_dish表中获取指定类型的可用菜品
        List<Dish> dishes = dishRepository.findByDishTypeAndIsAvailableOrderBySortOrderAscPriceAsc(dishType, true);
        return dishes.stream()
                .map(this::convertDishToMenu)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<Menu> getMenuItemByName(String dishName) {
        // 从t_dish表中查找菜品
        Optional<Dish> dish = dishRepository.findByDishNameAndIsAvailable(dishName, true);
        return dish.map(this::convertDishToMenu);
    }
    
    @Override
    public boolean isMenuItemAvailable(String dishName) {
        // 检查t_dish表中是否存在该菜品且可用
        return dishRepository.existsByDishNameAndIsAvailable(dishName, true);
    }
    
    /**
     * 将Dish对象转换为Menu对象
     */
    private Menu convertDishToMenu(Dish dish) {
        Menu menu = new Menu();
        menu.setId(dish.getId());
        menu.setDishName(dish.getDishName());
        menu.setDishType(dish.getDishType());
        menu.setPrice(dish.getPrice());
        menu.setDescription(dish.getDescription());
        menu.setImageUrl(dish.getImageUrl());
        menu.setIsAvailable(dish.getIsAvailable());
        menu.setEstimatedTime(dish.getEstimatedTime());
        menu.setCreatedAt(dish.getCreatedAt());
        menu.setUpdatedAt(dish.getUpdatedAt());
        return menu;
    }
    
    @Override
    @Transactional
    public Menu createMenuItem(Menu menu) {
        menu.setCreatedAt(new Date());
        menu.setUpdatedAt(new Date());
        if (menu.getIsAvailable() == null) {
            menu.setIsAvailable(true);
        }
        return menuRepository.save(menu);
    }
    
    @Override
    @Transactional
    public Menu updateMenuItem(Menu menu) {
        menu.setUpdatedAt(new Date());
        return menuRepository.save(menu);
    }
    
    @Override
    @Transactional
    public void deleteMenuItem(Long id) {
        menuRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public Menu setMenuItemAvailability(Long id, Boolean isAvailable) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("菜品不存在: " + id));
        menu.setIsAvailable(isAvailable);
        menu.setUpdatedAt(new Date());
        return menuRepository.save(menu);
    }
}