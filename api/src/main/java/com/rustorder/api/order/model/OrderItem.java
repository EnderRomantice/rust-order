package com.rustorder.api.order.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 订单项实体类
 * 表示订单中的单个菜品项
 */
@Data
@Entity
@Table(name = "t_order_item")
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "dish_name", nullable = false)
    private String dishName;
    
    @Column(name = "dish_type", nullable = false)
    private String dishType;
    
    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "subtotal", nullable = false)
    private Double subtotal; // 小计 = unitPrice * quantity
    
    @Column(name = "estimated_time")
    private Integer estimatedTime; // 单个菜品的预计制作时间（分钟）
    
    @Column(name = "item_notes", columnDefinition = "TEXT")
    private String itemNotes; // 菜品级别的特殊要求（如：不要辣、少盐等）
    
    // 多对一关系：多个订单项属于一个订单
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderNew order;
    
    // 便利方法：计算小计
    public void calculateSubtotal() {
        if (unitPrice != null && quantity != null) {
            this.subtotal = unitPrice * quantity;
        }
    }
    
    @PrePersist
    @PreUpdate
    protected void onSave() {
        calculateSubtotal();
    }
}