package com.rustorder.api.order.service;

import com.rustorder.api.order.model.Order;
import java.util.List;

public interface OrderService {
    List<Order> getAllOrders();
    Order getOrderById(Long id);
    Order createOrder(Order order);
    Order updateOrder(Order order);
    void deleteOrder(Long id);
    List<Order> getOrdersByType(String orderType);
    
    /**
     * 从购物车创建订单并返回取餐码
     * @param userId 用户ID
     * @return 取餐码
     */
    String createOrderFromCart(String userId);
    
    /**
     * 直接点餐下单
     * @param order 订单信息
     * @return 取餐码
     */
    String placeDirectOrder(Order order);
}