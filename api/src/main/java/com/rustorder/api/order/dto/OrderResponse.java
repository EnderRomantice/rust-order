package com.rustorder.api.order.dto;

import com.rustorder.api.order.model.OrderStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;
import java.util.List;

/**
 * 订单响应DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    
    private Long id;
    
    private String userId;
    
    private String pickupCode;
    
    private OrderStatus orderStatus;
    
    private Integer queueNumber;
    
    private String notes;
    
    private Double totalPrice;
    
    private Integer totalEstimatedTime;
    
    private Date createdAt;
    
    private Date updatedAt;
    
    private List<OrderItemResponse> items;
}