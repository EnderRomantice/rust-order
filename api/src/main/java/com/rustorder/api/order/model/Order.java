package com.rustorder.api.order.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@Table(name = "t_order")
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(name = "order_type")
    private String orderType;

    private Double price;
    
    private Integer quantity;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "pickup_code")
    private String pickupCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus orderStatus;
    
    @Column(name = "created_at")
    private Date createdAt;
    
    @Column(name = "updated_at")
    private Date updatedAt;
    
    @Column(name = "estimated_time")
    private Integer estimatedTime; // 预计制作时间（分钟）
    
    @Column(name = "queue_number")
    private Integer queueNumber; // 队列号
    
    @Column(name = "notes")
    private String notes; // 备注
}