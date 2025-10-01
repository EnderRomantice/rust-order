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
     * 获取热门菜品（基于销量和评分）
     */
    @GetMapping("/popular")
    public ResponseEntity<List<Dish>> getPopularDishes(@RequestParam(defaultValue = "6") int limit) {
        List<Dish> popularDishes;
        
        if (limit <= 10) {
            // 使用预定义的Top10查询方法
            popularDishes = dishRepository.findTop10ByIsAvailableOrderBySalesCountDescRatingDescCreatedAtDesc(true);
        } else {
            // 获取所有热门菜品然后限制数量
            popularDishes = dishRepository.findByIsAvailableOrderBySalesCountDescRatingDescCreatedAtDesc(true);
        }
        
        // 限制返回数量
        List<Dish> result = popularDishes.stream()
                .limit(limit)
                .toList();
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * 获取高评分菜品
     */
    @GetMapping("/top-rated")
    public ResponseEntity<List<Dish>> getTopRatedDishes(
            @RequestParam(defaultValue = "4.0") double minRating,
            @RequestParam(defaultValue = "6") int limit) {
        List<Dish> topRatedDishes = dishRepository
                .findByIsAvailableAndRatingGreaterThanEqualOrderByRatingDescSalesCountDesc(true, minRating);
        
        List<Dish> result = topRatedDishes.stream()
                .limit(limit)
                .toList();
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * 获取新品推荐
     */
    @GetMapping("/new-arrivals")
    public ResponseEntity<List<Dish>> getNewArrivals() {
        List<Dish> newDishes = dishRepository.findTop5ByIsAvailableOrderByCreatedAtDesc(true);
        return ResponseEntity.ok(newDishes);
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
            if (dish.getSalesCount() == null) {
                dish.setSalesCount(0);
            }
            if (dish.getRating() == null) {
                dish.setRating(0.0);
            }
            if (dish.getRatingCount() == null) {
                dish.setRatingCount(0);
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
                if (dish.getSalesCount() == null) {
                    dish.setSalesCount(0);
                }
                if (dish.getRating() == null) {
                    dish.setRating(0.0);
                }
                if (dish.getRatingCount() == null) {
                    dish.setRatingCount(0);
                }
            });
            
            List<Dish> savedDishes = dishRepository.saveAll(dishes);
            return new ResponseEntity<>(savedDishes, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 菜品评分
     */
    @PostMapping("/{id}/rate")
    public ResponseEntity<Dish> rateDish(
            @PathVariable Long id, 
            @RequestBody Map<String, Double> request) {
        try {
            Optional<Dish> dishOpt = dishRepository.findById(id);
            if (dishOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Dish dish = dishOpt.get();
            Double newRating = request.get("rating");
            
            // 验证评分范围
            if (newRating == null || newRating < 0 || newRating > 5) {
                return ResponseEntity.badRequest().build();
            }
            
            // 计算新的平均评分
            int currentRatingCount = dish.getRatingCount();
            double currentRating = dish.getRating();
            
            // 新的评分总数
            int newRatingCount = currentRatingCount + 1;
            
            // 计算新的平均评分
            double newAverageRating = ((currentRating * currentRatingCount) + newRating) / newRatingCount;
            
            // 更新菜品评分信息
            dish.setRating(Math.round(newAverageRating * 100.0) / 100.0); // 保留两位小数
            dish.setRatingCount(newRatingCount);
            dish.setUpdatedAt(new Date());
            
            Dish updatedDish = dishRepository.save(dish);
            return ResponseEntity.ok(updatedDish);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 增加菜品销量（订单完成时调用）
     */
    @PostMapping("/{id}/increment-sales")
    public ResponseEntity<Dish> incrementSales(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        try {
            Optional<Dish> dishOpt = dishRepository.findById(id);
            if (dishOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Dish dish = dishOpt.get();
            Integer quantity = request.get("quantity");
            if (quantity == null || quantity <= 0) {
                quantity = 1;
            }
            
            // 增加销量
            dish.setSalesCount(dish.getSalesCount() + quantity);
            dish.setUpdatedAt(new Date());
            
            Dish updatedDish = dishRepository.save(dish);
            return ResponseEntity.ok(updatedDish);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}