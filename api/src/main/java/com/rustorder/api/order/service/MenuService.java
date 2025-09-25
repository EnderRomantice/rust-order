package com.rustorder.api.order.service;

import com.rustorder.api.order.model.Menu;

import java.util.List;
import java.util.Optional;

public interface MenuService {
    
    /**
     * 获取所有可用菜品
     */
    List<Menu> getAvailableMenuItems();
    
    /**
     * 获取所有菜品（包括已下架的，用于管理端）
     */
    List<Menu> getAllMenuItems();
    
    /**
     * 根据菜品类型获取可用菜品
     */
    List<Menu> getAvailableMenuItemsByType(String dishType);
    
    /**
     * 根据菜品名称获取菜单项
     */
    Optional<Menu> getMenuItemByName(String dishName);
    
    /**
     * 验证菜品是否可点餐
     */
    boolean isMenuItemAvailable(String dishName);
    
    /**
     * 创建菜单项
     */
    Menu createMenuItem(Menu menu);
    
    /**
     * 更新菜单项
     */
    Menu updateMenuItem(Menu menu);
    
    /**
     * 删除菜单项
     */
    void deleteMenuItem(Long id);
    
    /**
     * 设置菜品可用状态
     */
    Menu setMenuItemAvailability(Long id, Boolean isAvailable);
}