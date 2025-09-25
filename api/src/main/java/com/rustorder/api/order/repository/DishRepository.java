package com.rustorder.api.order.repository;

import com.rustorder.api.order.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    
    /**
     * 根据菜品名称查找菜品
     */
    Optional<Dish> findByDishName(String dishName);
    
    /**
     * 根据菜品名称和可用状态查找菜品
     */
    Optional<Dish> findByDishNameAndIsAvailable(String dishName, Boolean isAvailable);
    
    /**
     * 获取所有可用的菜品，按类型和排序顺序排列
     */
    List<Dish> findByIsAvailableOrderByDishTypeAscSortOrderAsc(Boolean isAvailable);
    
    /**
     * 根据菜品类型获取可用菜品
     */
    List<Dish> findByDishTypeAndIsAvailableOrderBySortOrderAscPriceAsc(String dishType, Boolean isAvailable);
    
    /**
     * 检查菜品是否存在且可用
     */
    boolean existsByDishNameAndIsAvailable(String dishName, Boolean isAvailable);
    
    /**
     * 获取所有菜品类型
     */
    List<String> findDistinctDishTypeByIsAvailable(Boolean isAvailable);
}