package com.rustorder.api.order.repository;

import com.rustorder.api.order.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    
    /**
     * 根据菜品名称查找菜单项
     */
    Optional<Menu> findByDishName(String dishName);
    
    /**
     * 根据菜品名称和可用状态查找菜单项
     */
    Optional<Menu> findByDishNameAndIsAvailable(String dishName, Boolean isAvailable);
    
    /**
     * 获取所有可用的菜品
     */
    List<Menu> findByIsAvailableOrderByDishTypeAsc(Boolean isAvailable);
    
    /**
     * 根据菜品类型获取可用菜品
     */
    List<Menu> findByDishTypeAndIsAvailableOrderByPriceAsc(String dishType, Boolean isAvailable);
    
    /**
     * 检查菜品是否存在且可用
     */
    boolean existsByDishNameAndIsAvailable(String dishName, Boolean isAvailable);
}