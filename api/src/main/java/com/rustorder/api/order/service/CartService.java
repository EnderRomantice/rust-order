package com.rustorder.api.order.service;

import com.rustorder.api.order.model.Cart;
import com.rustorder.api.order.model.CartItem;

public interface CartService {
    
    /**
     * 获取用户的购物车
     * @param userId 用户ID
     * @return 购物车对象
     */
    Cart getCart(String userId);
    
    /**
     * 添加商品到购物车
     * @param userId 用户ID
     * @param item 商品项
     * @return 更新后的购物车
     */
    Cart addItemToCart(String userId, CartItem item);
    
    /**
     * 从购物车移除商品
     * @param userId 用户ID
     * @param name 商品名称
     * @param orderType 商品类型
     * @return 更新后的购物车
     */
    Cart removeItemFromCart(String userId, String name, String orderType);
    
    /**
     * 更新购物车中商品的数量
     * @param userId 用户ID
     * @param name 商品名称
     * @param orderType 商品类型
     * @param quantity 新数量
     * @return 更新后的购物车
     */
    Cart updateItemQuantity(String userId, String name, String orderType, Integer quantity);
    
    /**
     * 清空用户的购物车
     * @param userId 用户ID
     */
    void clearCart(String userId);
    
    /**
     * 检查购物车是否为空
     * @param userId 用户ID
     * @return 是否为空
     */
    boolean isCartEmpty(String userId);
}