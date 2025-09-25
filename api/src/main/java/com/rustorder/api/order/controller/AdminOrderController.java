package com.rustorder.api.order.controller;

import com.rustorder.api.order.dto.OrderResponse;
import com.rustorder.api.order.model.OrderStatus;
import com.rustorder.api.order.service.ImprovedOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    
    private final ImprovedOrderService orderService;
    
    @Autowired
    public AdminOrderController(ImprovedOrderService orderService) {
        this.orderService = orderService;
    }
    
    /**
     * 获取订单队列（现在不需要按取餐码分组，因为一个取餐码对应一个订单）
     */
    @GetMapping("/queue")
    public ResponseEntity<List<OrderResponse>> getOrderQueue() {
        List<OrderResponse> queuedOrders = orderService.getOrderQueue();
        return ResponseEntity.ok(queuedOrders);
    }
    
    /**
     * 获取所有订单
     */
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    /**
     * 根据状态获取订单
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(@PathVariable String status) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            List<OrderResponse> orders = orderService.getOrdersByStatus(orderStatus);
            return ResponseEntity.ok(orders);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 确认订单（从待处理转为已确认）
     */
    @PostMapping("/{orderId}/confirm")
    public ResponseEntity<OrderResponse> confirmOrder(@PathVariable Long orderId, @RequestBody(required = false) Map<String, String> request) {
        String notes = request != null ? request.get("notes") : null;
        OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, OrderStatus.CONFIRMED, notes);
        return ResponseEntity.ok(updatedOrder);
    }
    
    /**
     * 开始制作订单（从已确认转为制作中）
     */
    @PostMapping("/{orderId}/start")
    public ResponseEntity<OrderResponse> startPreparingOrder(@PathVariable Long orderId, @RequestBody(required = false) Map<String, String> request) {
        String notes = request != null ? request.get("notes") : null;
        OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, OrderStatus.PREPARING, notes);
        return ResponseEntity.ok(updatedOrder);
    }
    
    /**
     * 完成制作（从制作中转为待取餐）
     */
    @PostMapping("/{orderId}/ready")
    public ResponseEntity<OrderResponse> markOrderReady(@PathVariable Long orderId, @RequestBody(required = false) Map<String, String> request) {
        String notes = request != null ? request.get("notes") : null;
        OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, OrderStatus.READY, notes);
        return ResponseEntity.ok(updatedOrder);
    }
    
    /**
     * 完成订单（从待取餐转为已完成）
     */
    @PostMapping("/{orderId}/complete")
    public ResponseEntity<OrderResponse> completeOrder(@PathVariable Long orderId, @RequestBody(required = false) Map<String, String> request) {
        String notes = request != null ? request.get("notes") : null;
        OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, OrderStatus.COMPLETED, notes);
        return ResponseEntity.ok(updatedOrder);
    }
    
    /**
     * 取消订单
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long orderId, @RequestBody(required = false) Map<String, String> request) {
        String notes = request != null ? request.get("notes") : null;
        OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED, notes);
        return ResponseEntity.ok(updatedOrder);
    }
    
    /**
     * 根据ID获取订单详情
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId) {
        OrderResponse order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }
}