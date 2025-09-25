package com.rustorder.api.order.repository;

import com.rustorder.api.order.model.Order;
import com.rustorder.api.order.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByOrderType(String orderType);
    
    // 订单队列相关查询
    List<Order> findByOrderStatusOrderByQueueNumberAsc(OrderStatus status);
    
    List<Order> findByOrderStatusInOrderByQueueNumberAsc(List<OrderStatus> statuses);
    
    int countByOrderStatus(OrderStatus status);
    
    List<Order> findByPickupCode(String pickupCode);
    
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
}