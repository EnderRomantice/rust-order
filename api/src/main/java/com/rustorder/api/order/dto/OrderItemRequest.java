package com.rustorder.api.order.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 订单项请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {
    
    private String dishName;
    
    private String dishType;
    
    private Double unitPrice;
    
    private Integer quantity;
    
    private Integer estimatedTime;
    
    private String itemNotes; // 菜品级别备注（如：不要辣、少盐等）
}