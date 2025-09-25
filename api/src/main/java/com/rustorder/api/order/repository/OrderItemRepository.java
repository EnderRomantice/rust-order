package com.rustorder.api.order.repository;

import com.rustorder.api.order.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // 根据订单ID查询订单项
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);
    
    // 根据菜品名称查询订单项
    List<OrderItem> findByDishName(String dishName);
    
    // 根据菜品类型查询订单项
    List<OrderItem> findByDishType(String dishType);
    
    // 根据订单ID删除订单项
    @Modifying
    @Query("DELETE FROM OrderItem oi WHERE oi.order.id = :orderId")
    void deleteByOrderId(@Param("orderId") Long orderId);
    
    // 统计指定订单的菜品项数量
    @Query("SELECT COUNT(oi) FROM OrderItem oi WHERE oi.order.id = :orderId")
    int countByOrderId(@Param("orderId") Long orderId);
    
    // 计算指定订单的总价
    @Query("SELECT SUM(oi.subtotal) FROM OrderItem oi WHERE oi.order.id = :orderId")
    Double calculateTotalPriceByOrderId(@Param("orderId") Long orderId);
    
    // 计算指定订单的总预计时间（取最大值）
    @Query("SELECT MAX(oi.estimatedTime) FROM OrderItem oi WHERE oi.order.id = :orderId")
    Integer calculateMaxEstimatedTimeByOrderId(@Param("orderId") Long orderId);
}