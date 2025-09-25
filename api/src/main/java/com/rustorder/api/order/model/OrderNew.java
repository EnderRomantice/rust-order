package com.rustorder.api.order.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 改进的订单实体类
 * 一个订单对应一个取餐码，包含多个订单项
 */
@Data
@Entity
@Table(name = "t_order_new")
@NoArgsConstructor
@AllArgsConstructor
public class OrderNew {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "pickup_code", unique = true, nullable = false, length = 6)
    private String pickupCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus orderStatus;
    
    @Column(name = "queue_number")
    private Integer queueNumber;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes; // 订单级别的备注
    
    @Column(name = "total_price", nullable = false)
    private Double totalPrice;
    
    @Column(name = "total_estimated_time")
    private Integer totalEstimatedTime; // 总预计时间（分钟）
    
    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
    // 一对多关系：一个订单包含多个订单项
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    // 便利方法：添加订单项
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    
    // 便利方法：移除订单项
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
    
    // 便利方法：计算总价
    public void calculateTotalPrice() {
        this.totalPrice = items.stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum();
    }
    
    // 便利方法：计算总预计时间（取最长时间）
    public void calculateTotalEstimatedTime() {
        this.totalEstimatedTime = items.stream()
                .mapToInt(item -> item.getEstimatedTime() != null ? item.getEstimatedTime() : 0)
                .max()
                .orElse(0);
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}