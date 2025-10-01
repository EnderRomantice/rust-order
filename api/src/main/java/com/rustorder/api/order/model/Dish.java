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
@Table(name = "t_dish")
@NoArgsConstructor
@AllArgsConstructor
public class Dish {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "dish_name", nullable = false, unique = true)
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
    
    @Column(name = "sort_order")
    private Integer sortOrder = 0;
    
    @Column(name = "sales_count")
    private Integer salesCount = 0;
    
    @Column(name = "rating")
    private Double rating = 0.0;
    
    @Column(name = "rating_count")
    private Integer ratingCount = 0;
    
    @Column(name = "created_at")
    private Date createdAt;
    
    @Column(name = "updated_at")
    private Date updatedAt;
}