package com.rustorder.api.order.controller;

import com.rustorder.api.order.model.OrderNew;
import com.rustorder.api.order.dto.CreateOrderRequest;
import com.rustorder.api.order.dto.OrderResponse;
import com.rustorder.api.order.service.ImprovedOrderService;
import com.rustorder.api.order.repository.OrderNewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final ImprovedOrderService orderService;
    private final OrderNewRepository orderRepository;

    @Autowired
    public OrderController(ImprovedOrderService orderService, OrderNewRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        return new ResponseEntity<>(orderService.createOrder(request), HttpStatus.CREATED);
    }
    
    /**
     * 直接点餐下单（手机端用）v2.0
     */
    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody CreateOrderRequest request) {
        try {
            OrderResponse response = orderService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable Long id, @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.updateOrder(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 根据取餐码查询订单（手机端用）v2.0
     */
    @GetMapping("/pickup/{pickupCode}")
    public ResponseEntity<OrderResponse> getOrderByPickupCode(@PathVariable String pickupCode) {
        OrderResponse order = orderService.getOrderByPickupCode(pickupCode);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    /**
     * 获取用户的订单历史（手机端用）v2.0
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getUserOrders(@PathVariable String userId) {
        List<OrderResponse> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
}