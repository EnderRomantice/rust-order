package com.rustorder.api.order.service.impl;

import com.rustorder.api.order.model.Cart;
import com.rustorder.api.order.model.CartItem;
import com.rustorder.api.order.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.Map;

@Service
public class CartServiceImpl implements CartService {
    
    private static final String CART_KEY_PREFIX = "cart:";
    private static final long CART_EXPIRE_TIME = 24; // 24小时过期
    
    // 内存存储作为Redis的备用方案
    private final Map<String, Cart> cartStorage = new ConcurrentHashMap<>();
    
    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;
    
    @Override
    public Cart getCart(String userId) {
        if (isRedisAvailable()) {
            try {
                String key = CART_KEY_PREFIX + userId;
                Cart cart = (Cart) redisTemplate.opsForValue().get(key);
                if (cart == null) {
                    cart = new Cart(userId);
                    saveCartToRedis(cart);
                }
                return cart;
            } catch (Exception e) {
                // Redis失败时降级到内存存储
                return cartStorage.computeIfAbsent(userId, Cart::new);
            }
        } else {
            return cartStorage.computeIfAbsent(userId, Cart::new);
        }
    }
    
    @Override
    public Cart addItemToCart(String userId, CartItem item) {
        Cart cart = getCart(userId);
        cart.addItem(item);
        saveCart(cart);
        return cart;
    }
    
    @Override
    public Cart removeItemFromCart(String userId, String name, String orderType) {
        Cart cart = getCart(userId);
        cart.removeItem(name, orderType);
        saveCart(cart);
        return cart;
    }
    
    @Override
    public Cart updateItemQuantity(String userId, String name, String orderType, Integer quantity) {
        Cart cart = getCart(userId);
        for (CartItem item : cart.getItems()) {
            if (item.getName().equals(name) && item.getOrderType().equals(orderType)) {
                if (quantity <= 0) {
                    cart.removeItem(name, orderType);
                } else {
                    item.setQuantity(quantity);
                }
                break;
            }
        }
        saveCart(cart);
        return cart;
    }
    
    @Override
    public void clearCart(String userId) {
        Cart cart = getCart(userId);
        cart.clear();
        saveCart(cart);
    }
    
    @Override
    public boolean isCartEmpty(String userId) {
        Cart cart = getCart(userId);
        return cart.getItems().isEmpty();
    }
    
    /**
     * 检查Redis是否可用
     */
    private boolean isRedisAvailable() {
        if (redisTemplate == null) {
            return false;
        }
        try {
            redisTemplate.getConnectionFactory().getConnection().ping();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * 保存购物车（自动选择存储方式）
     */
    private void saveCart(Cart cart) {
        if (isRedisAvailable()) {
            try {
                saveCartToRedis(cart);
            } catch (Exception e) {
                // Redis失败时，数据已经在内存中，无需额外操作
            }
        }
        // 内存存储已经在getCart时处理
    }
    
    /**
     * 保存购物车到Redis
     */
    private void saveCartToRedis(Cart cart) {
        String key = CART_KEY_PREFIX + cart.getUserId();
        redisTemplate.opsForValue().set(key, cart, CART_EXPIRE_TIME, TimeUnit.HOURS);
    }
}