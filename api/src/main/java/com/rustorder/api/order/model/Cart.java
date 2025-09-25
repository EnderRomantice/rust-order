package com.rustorder.api.order.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    
    private String userId;
    
    private List<CartItem> items = new ArrayList<>();
    
    private Date createdAt;
    
    private Date updatedAt;
    
    public Cart(String userId) {
        this.userId = userId;
        this.items = new ArrayList<>();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    
    /**
     * 添加商品到购物车
     */
    public void addItem(CartItem item) {
        // 检查是否已存在相同商品
        for (CartItem existingItem : items) {
            if (existingItem.getName().equals(item.getName()) && 
                existingItem.getOrderType().equals(item.getOrderType())) {
                // 如果存在，增加数量
                existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
                this.updatedAt = new Date();
                return;
            }
        }
        // 如果不存在，添加新商品
        items.add(item);
        this.updatedAt = new Date();
    }
    
    /**
     * 从购物车移除商品
     */
    public void removeItem(String name, String orderType) {
        items.removeIf(item -> item.getName().equals(name) && item.getOrderType().equals(orderType));
        this.updatedAt = new Date();
    }
    
    /**
     * 清空购物车
     */
    public void clear() {
        items.clear();
        this.updatedAt = new Date();
    }
    
    /**
     * 计算购物车总价
     */
    public Double getTotalPrice() {
        return items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
    
    /**
     * 获取购物车商品总数量
     */
    public Integer getTotalQuantity() {
        return items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
}