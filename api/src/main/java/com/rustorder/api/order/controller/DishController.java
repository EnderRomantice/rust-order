package com.rustorder.api.order.controller;

import com.rustorder.api.order.model.Dish;
import com.rustorder.api.order.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dishes")
public class DishController {
    
    private final DishRepository dishRepository;
    
    @Autowired
    public DishController(DishRepository dishRepository) {
        this.dishRepository = dishRepository;
    }
    
    /**
     * 获取所有可用菜品（用户端）
     */
    @GetMapping
    public ResponseEntity<List<Dish>> getAllAvailableDishes() {
        List<Dish> dishes = dishRepository.findByIsAvailableOrderByDishTypeAscSortOrderAsc(true);
        return ResponseEntity.ok(dishes);
    }
    
    /**
     * 根据类型获取菜品
     */
    @GetMapping("/type/{dishType}")
    public ResponseEntity<List<Dish>> getDishesByType(@PathVariable String dishType) {
        List<Dish> dishes = dishRepository.findByDishTypeAndIsAvailableOrderBySortOrderAscPriceAsc(dishType, true);
        return ResponseEntity.ok(dishes);
    }
    
    /**
     * 根据ID获取菜品详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<Dish> getDishById(@PathVariable Long id) {
        Optional<Dish> dish = dishRepository.findById(id);
        return dish.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * 获取所有菜品（管理员，包括已下架的）
     */
    @GetMapping("/admin")
    public ResponseEntity<List<Dish>> getAllDishesForAdmin() {
        List<Dish> dishes = dishRepository.findAll();
        return ResponseEntity.ok(dishes);
    }
    
    /**
     * 创建菜品（管理员）
     */
    @PostMapping("/admin")
    public ResponseEntity<Dish> createDish(@RequestBody Dish dish) {
        try {
            dish.setCreatedAt(new Date());
            dish.setUpdatedAt(new Date());
            if (dish.getIsAvailable() == null) {
                dish.setIsAvailable(true);
            }
            if (dish.getSortOrder() == null) {
                dish.setSortOrder(0);
            }
            Dish savedDish = dishRepository.save(dish);
            return new ResponseEntity<>(savedDish, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 更新菜品（管理员）
     */
    @PutMapping("/admin/{id}")
    public ResponseEntity<Dish> updateDish(@PathVariable Long id, @RequestBody Dish dish) {
        try {
            Optional<Dish> existingDish = dishRepository.findById(id);
            if (existingDish.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            dish.setId(id);
            dish.setUpdatedAt(new Date());
            // 保留创建时间
            dish.setCreatedAt(existingDish.get().getCreatedAt());
            
            Dish updatedDish = dishRepository.save(dish);
            return ResponseEntity.ok(updatedDish);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 删除菜品（管理员）
     */
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        try {
            if (!dishRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            dishRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 设置菜品可用状态（管理员）
     */
    @PatchMapping("/admin/{id}/availability")
    public ResponseEntity<Dish> setDishAvailability(
            @PathVariable Long id, 
            @RequestBody Map<String, Boolean> request) {
        try {
            Optional<Dish> dishOpt = dishRepository.findById(id);
            if (dishOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Dish dish = dishOpt.get();
            Boolean isAvailable = request.get("isAvailable");
            dish.setIsAvailable(isAvailable);
            dish.setUpdatedAt(new Date());
            
            Dish updatedDish = dishRepository.save(dish);
            return ResponseEntity.ok(updatedDish);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 批量创建菜品（管理员）
     */
    @PostMapping("/admin/batch")
    public ResponseEntity<List<Dish>> createDishesInBatch(@RequestBody List<Dish> dishes) {
        try {
            Date now = new Date();
            dishes.forEach(dish -> {
                dish.setCreatedAt(now);
                dish.setUpdatedAt(now);
                if (dish.getIsAvailable() == null) {
                    dish.setIsAvailable(true);
                }
                if (dish.getSortOrder() == null) {
                    dish.setSortOrder(0);
                }
            });
            
            List<Dish> savedDishes = dishRepository.saveAll(dishes);
            return new ResponseEntity<>(savedDishes, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}