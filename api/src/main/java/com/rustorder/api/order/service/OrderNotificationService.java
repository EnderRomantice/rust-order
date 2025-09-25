package com.rustorder.api.order.service;

import com.rustorder.api.order.model.Order;
import com.rustorder.api.order.model.OrderStatus;

public interface OrderNotificationService {
    
    /**
     * 通知新订单创建
     * @param order 新创建的订单
     */
    void notifyNewOrder(Order order);
    
    /**
     * 通知订单状态变化
     * @param order 订单对象
     * @param oldStatus 旧状态
     * @param newStatus 新状态
     */
    void notifyOrderStatusChange(Order order, OrderStatus oldStatus, OrderStatus newStatus);
    
    /**
     * 通知队列统计信息更新
     */
    void notifyQueueStatisticsUpdate();
    
    /**
     * 通知用户订单状态变化（发送给特定用户）
     * @param userId 用户ID
     * @param order 订单对象
     * @param message 通知消息
     */
    void notifyUserOrderUpdate(String userId, Order order, String message);
}