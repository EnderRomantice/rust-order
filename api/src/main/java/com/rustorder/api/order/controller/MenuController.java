package com.rustorder.api.order.controller;

import com.rustorder.api.order.model.Menu;
import com.rustorder.api.order.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    
    private final MenuService menuService;
    
    @Autowired
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }
    
    /**
     * 获取所有可用菜品（手机端用）
     */
    @GetMapping
    public ResponseEntity<List<Menu>> getAvailableMenu() {
        List<Menu> menuItems = menuService.getAvailableMenuItems();
        return ResponseEntity.ok(menuItems);
    }
    
    /**
     * 根据菜品类型获取菜品
     */
    @GetMapping("/type/{dishType}")
    public ResponseEntity<List<Menu>> getMenuByType(@PathVariable String dishType) {
        List<Menu> menuItems = menuService.getAvailableMenuItemsByType(dishType);
        return ResponseEntity.ok(menuItems);
    }
    
    /**
     * 根据菜品名称获取菜品详情
     */
    @GetMapping("/dish/{dishName}")
    public ResponseEntity<Menu> getMenuItemByName(@PathVariable String dishName) {
        Optional<Menu> menuItem = menuService.getMenuItemByName(dishName);
        return menuItem.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * 验证菜品是否可点餐
     */
    @GetMapping("/check/{dishName}")
    public ResponseEntity<Map<String, Boolean>> checkMenuItemAvailability(@PathVariable String dishName) {
        boolean isAvailable = menuService.isMenuItemAvailable(dishName);
        return ResponseEntity.ok(Map.of("available", isAvailable));
    }
    
    /**
     * 创建菜单项（管理员用）
     */
    @PostMapping("/admin")
    public ResponseEntity<Menu> createMenuItem(@RequestBody Menu menu) {
        try {
            Menu createdMenu = menuService.createMenuItem(menu);
            return new ResponseEntity<>(createdMenu, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 更新菜单项（管理员用）
     */
    @PutMapping("/admin/{id}")
    public ResponseEntity<Menu> updateMenuItem(@PathVariable Long id, @RequestBody Menu menu) {
        try {
            menu.setId(id);
            Menu updatedMenu = menuService.updateMenuItem(menu);
            return ResponseEntity.ok(updatedMenu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 删除菜单项（管理员用）
     */
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        try {
            menuService.deleteMenuItem(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 设置菜品可用状态（管理员用）
     */
    @PatchMapping("/admin/{id}/availability")
    public ResponseEntity<Menu> setMenuItemAvailability(
            @PathVariable Long id, 
            @RequestBody Map<String, Boolean> request) {
        try {
            Boolean isAvailable = request.get("isAvailable");
            Menu updatedMenu = menuService.setMenuItemAvailability(id, isAvailable);
            return ResponseEntity.ok(updatedMenu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}