package com.rustorder.api.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 队列位置响应DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueuePositionResponse {
    
    /**
     * 用户是否有活跃订单在队列中
     */
    private boolean hasActiveOrder;
    
    /**
     * 用户前面有多少个订单
     */
    private int ordersAhead;
    
    /**
     * 用户的队列号
     */
    private int queueNumber;
    
    /**
     * 订单状态
     */
    private String orderStatus;
}