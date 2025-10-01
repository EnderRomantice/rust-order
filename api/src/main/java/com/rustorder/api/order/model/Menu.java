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
    private String dishName;
    
    @Column(name = "dish_type", nullable = false)
    private String dishType;
    
    @Column(name = "price", nullable = false)
    private Double price;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;
    
    @Column(name = "estimated_time")
    private Integer estimatedTime;
    
    @Column(name = "created_at")
    private Date createdAt;
    
    @Column(name = "updated_at")
    private Date updatedAt;
}