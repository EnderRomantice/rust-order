package com.rustorder.api.order.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    
    private String name;
    
    private String orderType;
    
    private Double price;
    
    private Integer quantity;
    
    public CartItem(String name, String orderType, Double price) {
        this.name = name;
        this.orderType = orderType;
        this.price = price;
        this.quantity = 1;
    }
}