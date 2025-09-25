package com.rustorder.api.order.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 订单项响应DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    
    private Long id;
    
    private String dishName;
    
    private String dishType;
    
    private Double unitPrice;
    
    private Integer quantity;
    
    private Double subtotal;
    
    private Integer estimatedTime;
    
    private String itemNotes;
}