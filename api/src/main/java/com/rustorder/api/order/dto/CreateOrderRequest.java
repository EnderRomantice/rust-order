package com.rustorder.api.order.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * 创建订单请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    
    private String userId;
    
    private String notes; // 订单级别备注
    
    private List<OrderItemRequest> items;
}