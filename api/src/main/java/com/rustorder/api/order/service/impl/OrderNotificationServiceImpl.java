package com.rustorder.api.order.service.impl;

import com.rustorder.api.order.model.Order;
import com.rustorder.api.order.model.OrderStatus;
import com.rustorder.api.order.service.OrderNotificationService;
import com.rustorder.api.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderNotificationServiceImpl implements OrderNotificationService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Override
    public void notifyNewOrder(Order order) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "NEW_ORDER");
        message.put("order", order);
        message.put("message", "新订单已创建，取餐码: " + order.getPickupCode());
        
        // 发送给后台管理员
        messagingTemplate.convertAndSend("/topic/admin/orders", message);
        
        // 同时更新队列统计
        notifyQueueStatisticsUpdate();
    }
    
    @Override
    public void notifyOrderStatusChange(Order order, OrderStatus oldStatus, OrderStatus newStatus) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "STATUS_CHANGE");
        message.put("order", order);
        message.put("oldStatus", oldStatus.getDisplayName());
        message.put("newStatus", newStatus.getDisplayName());
        message.put("message", String.format("订单 %s 状态从 %s 变更为 %s", 
                order.getPickupCode(), oldStatus.getDisplayName(), newStatus.getDisplayName()));
        
        // 发送给后台管理员
        messagingTemplate.convertAndSend("/topic/admin/orders", message);
        
        // 发送给特定用户
        notifyUserOrderUpdate(order.getUserId(), order, 
                String.format("您的订单状态已更新为: %s", newStatus.getDisplayName()));
        
        // 更新队列统计
        notifyQueueStatisticsUpdate();
    }
    
    @Override
    public void notifyQueueStatisticsUpdate() {
        // 直接计算统计信息，避免循环依赖
        int pendingCount = orderRepository.countByOrderStatus(OrderStatus.PENDING);
        int preparingCount = orderRepository.countByOrderStatus(OrderStatus.PREPARING);
        int readyCount = orderRepository.countByOrderStatus(OrderStatus.READY);
        int totalInQueue = pendingCount + preparingCount + readyCount;
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("pendingCount", pendingCount);
        statistics.put("preparingCount", preparingCount);
        statistics.put("readyCount", readyCount);
        statistics.put("totalInQueue", totalInQueue);
        statistics.put("averageWaitTime", 0.0); // 简化处理
        
        Map<String, Object> message = new HashMap<>();
        message.put("type", "QUEUE_STATISTICS");
        message.put("statistics", statistics);
        
        // 发送给后台管理员
        messagingTemplate.convertAndSend("/topic/admin/statistics", message);
    }
    
    @Override
    public void notifyUserOrderUpdate(String userId, Order order, String notificationMessage) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "ORDER_UPDATE");
        message.put("order", order);
        message.put("message", notificationMessage);
        message.put("pickupCode", order.getPickupCode());
        message.put("status", order.getOrderStatus().getDisplayName());
        
        // 发送给特定用户
        messagingTemplate.convertAndSendToUser(userId, "/queue/orders", message);
    }
}