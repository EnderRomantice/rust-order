package com.rustorder.api.order.service.impl;

import com.rustorder.api.order.model.Order;
import com.rustorder.api.order.model.OrderStatus;
import com.rustorder.api.order.repository.OrderRepository;
import com.rustorder.api.order.service.OrderNotificationService;
import com.rustorder.api.order.service.OrderQueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class OrderQueueServiceImpl implements OrderQueueService {
    
    private final OrderRepository orderRepository;
    private final AtomicInteger queueCounter = new AtomicInteger(1);
    
    @Autowired
    private OrderNotificationService notificationService;
    
    @Autowired
    public OrderQueueServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    
    @Override
    @Transactional
    public Integer addToQueue(Order order) {
        // 设置队列号
        Integer queueNumber = queueCounter.getAndIncrement();
        order.setQueueNumber(queueNumber);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setUpdatedAt(new Date());
        
        // 根据商品类型估算制作时间
        order.setEstimatedTime(calculateEstimatedTime(order));
        
        orderRepository.save(order);
        return queueNumber;
    }
    
    @Override
    public List<Order> getQueuedOrders() {
        return orderRepository.findByOrderStatusInOrderByQueueNumberAsc(
            List.of(OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY)
        );
    }
    
    @Override
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByOrderStatusOrderByQueueNumberAsc(status);
    }
    
    @Override
    public Order getNextPendingOrder() {
        List<Order> pendingOrders = orderRepository.findByOrderStatusOrderByQueueNumberAsc(OrderStatus.PENDING);
        return pendingOrders.isEmpty() ? null : pendingOrders.get(0);
    }
    
    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus, String notes) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在: " + orderId));
        
        OrderStatus oldStatus = order.getOrderStatus();
        
        // 检查状态转换是否合法
        if (!oldStatus.canTransitionTo(newStatus)) {
            throw new RuntimeException(
                String.format("订单状态不能从 %s 转换到 %s", 
                    oldStatus.getDisplayName(), 
                    newStatus.getDisplayName())
            );
        }
        
        order.setOrderStatus(newStatus);
        order.setUpdatedAt(new Date());
        if (notes != null && !notes.trim().isEmpty()) {
            order.setNotes(notes);
        }
        
        Order savedOrder = orderRepository.save(order);
        
        // 发送状态变化通知
        notificationService.notifyOrderStatusChange(savedOrder, oldStatus, newStatus);
        
        return savedOrder;
    }
    
    @Override
    public QueueStatistics getQueueStatistics() {
        int pendingCount = orderRepository.countByOrderStatus(OrderStatus.PENDING);
        int preparingCount = orderRepository.countByOrderStatus(OrderStatus.PREPARING);
        int readyCount = orderRepository.countByOrderStatus(OrderStatus.READY);
        int totalInQueue = pendingCount + preparingCount + readyCount;
        
        // 计算平均等待时间（简化计算）
        double averageWaitTime = calculateAverageWaitTime();
        
        return new QueueStatistics(pendingCount, preparingCount, readyCount, totalInQueue, averageWaitTime);
    }
    
    /**
     * 根据商品类型计算预计制作时间
     */
    private Integer calculateEstimatedTime(Order order) {
        switch (order.getOrderType()) {
            case "主食":
            case "Main Course":
                return 15; // 15分钟
            case "小食":
            case "Snack":
                return 8; // 8分钟
            case "饮品":
            case "Drink":
                return 3; // 3分钟
            case "汤品":
            case "Soup":
                return 10; // 10分钟
            default:
                return 12; // 默认12分钟
        }
    }
    
    /**
     * 计算平均等待时间
     */
    private double calculateAverageWaitTime() {
        List<Order> activeOrders = orderRepository.findByOrderStatusInOrderByQueueNumberAsc(
            List.of(OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING)
        );
        
        if (activeOrders.isEmpty()) {
            return 0.0;
        }
        
        double totalEstimatedTime = activeOrders.stream()
                .mapToInt(order -> order.getEstimatedTime() != null ? order.getEstimatedTime() : 12)
                .sum();
        
        return totalEstimatedTime / activeOrders.size();
    }
}