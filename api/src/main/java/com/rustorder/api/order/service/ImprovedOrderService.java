package com.rustorder.api.order.service;

import com.rustorder.api.order.dto.*;
import com.rustorder.api.order.model.*;
import com.rustorder.api.order.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 改进的订单服务类
 * 基于新的数据结构设计
 */
@Service
@Transactional
public class ImprovedOrderService {
    
    private final OrderNewRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    
    @Autowired
    public ImprovedOrderService(OrderNewRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }
    
    /**
     * 创建订单
     * 现在一个订单包含多个菜品项，逻辑更清晰
     */
    public OrderResponse createOrder(CreateOrderRequest request) {
        OrderNew order = new OrderNew();
        order.setUserId(request.getUserId());
        order.setPickupCode(generatePickupCode());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setQueueNumber(generateQueueNumber());
        order.setNotes(request.getNotes());
        order.setCreatedAt(new Date());
        order.setUpdatedAt(new Date());
        
        // 创建订单项
        List<OrderItem> items = new ArrayList<>();
        double totalPrice = 0.0;
        int maxEstimatedTime = 0;
        
        for (OrderItemRequest itemRequest : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setDishName(itemRequest.getDishName());
            item.setDishType(itemRequest.getDishType());
            item.setUnitPrice(itemRequest.getUnitPrice());
            item.setQuantity(itemRequest.getQuantity());
            item.setSubtotal(itemRequest.getUnitPrice() * itemRequest.getQuantity());
            item.setEstimatedTime(itemRequest.getEstimatedTime());
            item.setItemNotes(itemRequest.getItemNotes());
            item.setOrder(order);
            items.add(item);
        
            totalPrice += item.getSubtotal();
            maxEstimatedTime = Math.max(maxEstimatedTime, itemRequest.getEstimatedTime());
        }
        
        order.setItems(items);
        order.setTotalPrice(totalPrice);
        order.setTotalEstimatedTime(maxEstimatedTime);
        
        order = orderRepository.save(order);
        
        return convertToOrderResponse(order);
    }
    
    /**
     * 更新订单状态
     */
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus, String notes) {
        OrderNew order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("订单不存在"));
        
        order.setOrderStatus(newStatus);
        if (notes != null) {
            order.setNotes(notes);
        }
        order.setUpdatedAt(new Date());
        
        order = orderRepository.save(order);
        
        return convertToOrderResponse(order);
    }
    
    /**
     * 根据取餐码查询订单
     * 现在一个取餐码只对应一个订单记录
     */
    public OrderResponse getOrderByPickupCode(String pickupCode) {
        OrderNew order = orderRepository.findByPickupCode(pickupCode)
            .orElseThrow(() -> new RuntimeException("订单不存在"));
        
        return convertToOrderResponse(order);
    }
    
    /**
     * 获取订单队列
     * 现在逻辑更简单，不需要按取餐码分组
     */
    public List<OrderResponse> getOrderQueue() {
        List<OrderNew> orders = orderRepository.findByOrderStatusInOrderByQueueNumberAsc(
            Arrays.asList(OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING)
        );
        
        return orders.stream()
            .map(this::convertToOrderResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * 获取所有订单
     */
    public List<OrderResponse> getAllOrders() {
        List<OrderNew> orders = orderRepository.findAll();
        return orders.stream()
            .map(this::convertToOrderResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * 根据ID获取订单
     */
    public OrderResponse getOrderById(Long id) {
        OrderNew order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("订单不存在"));
        return convertToOrderResponse(order);
    }
    
    /**
     * 获取用户订单
     */
    public List<OrderResponse> getUserOrders(String userId) {
        List<OrderNew> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
            .map(this::convertToOrderResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * 根据状态获取订单
     */
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        List<OrderNew> orders = orderRepository.findByOrderStatusOrderByQueueNumberAsc(status);
        // 按更新时间倒序排序（最新的在前）
        orders.sort((a, b) -> {
            Date dateA = a.getUpdatedAt() != null ? a.getUpdatedAt() : a.getCreatedAt();
            Date dateB = b.getUpdatedAt() != null ? b.getUpdatedAt() : b.getCreatedAt();
            return dateB.compareTo(dateA);
        });
        return orders.stream()
            .map(this::convertToOrderResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * 更新订单
     */
    public OrderResponse updateOrder(Long id, CreateOrderRequest request) {
        OrderNew order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("订单不存在"));
        
        // 只允许更新PENDING状态的订单
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("只能修改待处理状态的订单");
        }
        
        // 更新订单信息
        order.setUserId(request.getUserId());
        order.setNotes(request.getNotes());
        
        // 删除原有订单项
        orderItemRepository.deleteByOrderId(id);
        
        // 创建订单项并计算总价
        double totalPrice = 0.0;
        int maxEstimatedTime = 0;
        
        for (OrderItemRequest itemRequest : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setDishName(itemRequest.getDishName());
            item.setDishType(itemRequest.getDishType() != null ? itemRequest.getDishType() : "其他");
            item.setUnitPrice(itemRequest.getUnitPrice());
            item.setQuantity(itemRequest.getQuantity());
            item.setSubtotal(itemRequest.getUnitPrice() * itemRequest.getQuantity());
            item.setEstimatedTime(itemRequest.getEstimatedTime() != null ? itemRequest.getEstimatedTime() : 10);
            item.setItemNotes(itemRequest.getItemNotes());
            orderItemRepository.save(item);
            
            totalPrice += item.getSubtotal();
            maxEstimatedTime = Math.max(maxEstimatedTime, itemRequest.getEstimatedTime() != null ? itemRequest.getEstimatedTime() : 10);
        }
        
        // 更新订单总价和总时间
        order.setTotalPrice(totalPrice);
        order.setTotalEstimatedTime(maxEstimatedTime);
        
        OrderNew savedOrder = orderRepository.save(order);
        return convertToOrderResponse(savedOrder);
    }
    
    /**
     * 删除订单
     */
    public void deleteOrder(Long id) {
        OrderNew order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("订单不存在"));
        
        // 只允许删除PENDING或CANCELLED状态的订单
        if (order.getOrderStatus() != OrderStatus.PENDING && order.getOrderStatus() != OrderStatus.CANCELLED) {
            throw new RuntimeException("只能删除待处理或已取消状态的订单");
        }
        
        // 删除订单项
        orderItemRepository.deleteByOrderId(id);
        
        // 删除订单
        orderRepository.deleteById(id);
    }
    
    /**
     * 转换为响应DTO
     */
    private OrderResponse convertToOrderResponse(OrderNew order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setPickupCode(order.getPickupCode());
        response.setOrderStatus(order.getOrderStatus());
        response.setQueueNumber(order.getQueueNumber());
        response.setNotes(order.getNotes());
        response.setTotalPrice(order.getTotalPrice());
        response.setTotalEstimatedTime(order.getTotalEstimatedTime());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        
        // 转换订单项
        List<OrderItemResponse> itemResponses = order.getItems().stream()
            .map(this::convertToOrderItemResponse)
            .collect(Collectors.toList());
        response.setItems(itemResponses);
        
        return response;
    }
    
    /**
     * 转换订单项为响应DTO
     */
    private OrderItemResponse convertToOrderItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setDishName(item.getDishName());
        response.setDishType(item.getDishType());
        response.setUnitPrice(item.getUnitPrice());
        response.setQuantity(item.getQuantity());
        response.setSubtotal(item.getSubtotal());
        response.setEstimatedTime(item.getEstimatedTime());
        response.setItemNotes(item.getItemNotes());
        
        return response;
    }
    
    /**
     * 生成取餐码
     */
    private String generatePickupCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
    
    /**
     * 生成队列号
     */
    private Integer generateQueueNumber() {
        // 实际实现中应该查询当前最大队列号并+1
        return new Random().nextInt(100) + 1;
    }
}