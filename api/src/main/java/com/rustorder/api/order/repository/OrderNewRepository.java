package com.rustorder.api.order.repository;

import com.rustorder.api.order.model.OrderNew;
import com.rustorder.api.order.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderNewRepository extends JpaRepository<OrderNew, Long> {
    
    // 根据取餐码查询订单
    Optional<OrderNew> findByPickupCode(String pickupCode);
    
    // 根据用户ID查询订单历史
    List<OrderNew> findByUserIdOrderByCreatedAtDesc(String userId);
    
    // 根据订单状态查询，按队列号排序
    List<OrderNew> findByOrderStatusOrderByQueueNumberAsc(OrderStatus status);
    
    // 根据多个状态查询，按队列号排序
    List<OrderNew> findByOrderStatusInOrderByQueueNumberAsc(List<OrderStatus> statuses);
    
    // 统计指定状态的订单数量
    int countByOrderStatus(OrderStatus status);
    
    // 获取下一个队列号
    @Query("SELECT COALESCE(MAX(o.queueNumber), 0) + 1 FROM OrderNew o WHERE o.orderStatus IN :statuses")
    Integer getNextQueueNumber(@Param("statuses") List<OrderStatus> statuses);
    
    // 获取队列中的订单（待处理、已确认、制作中、待取餐）
    @Query("SELECT o FROM OrderNew o WHERE o.orderStatus IN ('PENDING', 'CONFIRMED', 'PREPARING', 'READY') ORDER BY o.queueNumber ASC")
    List<OrderNew> findQueuedOrders();
    
    // 获取下一个待处理的订单
    @Query("SELECT o FROM OrderNew o WHERE o.orderStatus = 'PENDING' ORDER BY o.queueNumber ASC LIMIT 1")
    Optional<OrderNew> findNextPendingOrder();
    
    // 检查取餐码是否已存在
    boolean existsByPickupCode(String pickupCode);
}