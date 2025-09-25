package com.rustorder.api.order.service;

import com.rustorder.api.order.model.Order;
import com.rustorder.api.order.model.OrderStatus;

import java.util.List;

public interface OrderQueueService {
    
    /**
     * 将订单加入队列
     * @param order 订单对象
     * @return 队列号
     */
    Integer addToQueue(Order order);
    
    /**
     * 获取队列中的所有订单（按队列号排序）
     * @return 队列中的订单列表
     */
    List<Order> getQueuedOrders();
    
    /**
     * 获取指定状态的订单
     * @param status 订单状态
     * @return 订单列表
     */
    List<Order> getOrdersByStatus(OrderStatus status);
    
    /**
     * 获取下一个待处理的订单
     * @return 下一个订单，如果队列为空则返回null
     */
    Order getNextPendingOrder();
    
    /**
     * 更新订单状态
     * @param orderId 订单ID
     * @param newStatus 新状态
     * @param notes 备注
     * @return 更新后的订单
     */
    Order updateOrderStatus(Long orderId, OrderStatus newStatus, String notes);
    
    /**
     * 获取队列统计信息
     * @return 队列统计
     */
    QueueStatistics getQueueStatistics();
    
    /**
     * 队列统计信息
     */
    class QueueStatistics {
        private int pendingCount;
        private int preparingCount;
        private int readyCount;
        private int totalInQueue;
        private double averageWaitTime; // 平均等待时间（分钟）
        
        public QueueStatistics(int pendingCount, int preparingCount, int readyCount, int totalInQueue, double averageWaitTime) {
            this.pendingCount = pendingCount;
            this.preparingCount = preparingCount;
            this.readyCount = readyCount;
            this.totalInQueue = totalInQueue;
            this.averageWaitTime = averageWaitTime;
        }
        
        // Getters
        public int getPendingCount() { return pendingCount; }
        public int getPreparingCount() { return preparingCount; }
        public int getReadyCount() { return readyCount; }
        public int getTotalInQueue() { return totalInQueue; }
        public double getAverageWaitTime() { return averageWaitTime; }
    }
}