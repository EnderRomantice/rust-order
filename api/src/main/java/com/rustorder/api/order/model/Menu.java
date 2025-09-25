package com.rustorder.api.order.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "t_menu")
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "dish_name", nullable = false)
    private String dishName; // 菜品名称
    
    @Column(name = "dish_type", nullable = false)
    private String dishType; // 菜品类型
    
    @Column(name = "price", nullable = false)
    private Double price; // 价格
    
    @Column(name = "description")
    private String description; // 菜品描述
    
    @Column(name = "image_url")
    private String imageUrl; // 菜品图片URL
    
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true; // 是否可用
    
    @Column(name = "estimated_time")
    private Integer estimatedTime; // 预计制作时间（分钟）
    
    @Column(name = "created_at")
    private Date createdAt;
    
    @Column(name = "updated_at")
    private Date updatedAt;
}