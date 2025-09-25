package com.rustorder.api.order.controller;

import com.rustorder.api.order.model.Cart;
import com.rustorder.api.order.model.CartItem;
import com.rustorder.api.order.service.CartService;
import com.rustorder.api.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    
    private final CartService cartService;
    private final OrderService orderService;
    
    @Autowired
    public CartController(CartService cartService, OrderService orderService) {
        this.cartService = cartService;
        this.orderService = orderService;
    }
    
    /**
     * 获取用户购物车
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable String userId) {
        Cart cart = cartService.getCart(userId);
        return ResponseEntity.ok(cart);
    }
    
    /**
     * 添加商品到购物车
     */
    @PostMapping("/{userId}/items")
    public ResponseEntity<Cart> addItemToCart(@PathVariable String userId, @RequestBody CartItem item) {
        Cart cart = cartService.addItemToCart(userId, item);
        return new ResponseEntity<>(cart, HttpStatus.CREATED);
    }
    
    /**
     * 从购物车移除商品
     */
    @DeleteMapping("/{userId}/items")
    public ResponseEntity<Cart> removeItemFromCart(
            @PathVariable String userId,
            @RequestParam String name,
            @RequestParam String orderType) {
        Cart cart = cartService.removeItemFromCart(userId, name, orderType);
        return ResponseEntity.ok(cart);
    }
    
    /**
     * 更新购物车中商品数量
     */
    @PutMapping("/{userId}/items")
    public ResponseEntity<Cart> updateItemQuantity(
            @PathVariable String userId,
            @RequestParam String name,
            @RequestParam String orderType,
            @RequestParam Integer quantity) {
        Cart cart = cartService.updateItemQuantity(userId, name, orderType, quantity);
        return ResponseEntity.ok(cart);
    }
    
    /**
     * 清空购物车
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * 从购物车创建订单
     */
    @PostMapping("/{userId}/checkout")
    public ResponseEntity<String> createOrderFromCart(@PathVariable String userId) {
        try {
            String pickupCode = orderService.createOrderFromCart(userId);
            return ResponseEntity.ok(pickupCode);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}