package com.rustorder.api.order.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rustorder.api.order.model.Cart;
import com.rustorder.api.order.model.Order;
import com.rustorder.api.order.model.OrderStatus;
import com.rustorder.api.order.repository.OrderRepository;
import com.rustorder.api.order.model.Dish;
import com.rustorder.api.order.repository.DishRepository;
import com.rustorder.api.order.service.CartService;
import com.rustorder.api.order.service.MenuService;
import com.rustorder.api.order.service.OrderNotificationService;
import com.rustorder.api.order.service.OrderQueueService;
import com.rustorder.api.order.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private OrderQueueService orderQueueService;
    
    @Autowired
    private OrderNotificationService notificationService;
    
    @Autowired
    private MenuService menuService;
    
    @Autowired
    private DishRepository dishRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    @Cacheable(value = "orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Override
    @CacheEvict(value = "orders", allEntries = true)
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    @CacheEvict(value = "orders", allEntries = true)
    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    @CacheEvict(value = "orders", allEntries = true)
    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }
    
    @Override
    public List<Order> getOrdersByType(String orderType) {
        return orderRepository.findByOrderType(orderType);
    }
    
    @Override
    @Transactional
    public String createOrderFromCart(String userId) {
        Cart cart = cartService.getCart(userId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("购物车为空，无法生成订单");
        }
        
        // 生成取餐码
        String pickupCode = generatePickupCode();
        
        // 将购物车中的商品转换为订单
        List<Order> orders = cart.getItems().stream().map(item -> {
            Order order = new Order();
            order.setName(item.getName());
            order.setOrderType(item.getOrderType());
            order.setPrice(item.getPrice());
            order.setQuantity(item.getQuantity());
            order.setUserId(userId);
            order.setPickupCode(pickupCode);
            order.setCreatedAt(new Date());
            order.setUpdatedAt(new Date());
            return order;
        }).collect(Collectors.toList());
        
        // 保存订单并加入队列
        orders.forEach(order -> {
            Order savedOrder = createOrder(order);
            orderQueueService.addToQueue(savedOrder);
            // 发送新订单通知
            notificationService.notifyNewOrder(savedOrder);
        });
        
        // 清空购物车
        cartService.clearCart(userId);
        
        return pickupCode;
    }
    
    @Override
    @Transactional
    public String placeDirectOrder(Order order) {
        // 验证订单信息
        if (order.getName() == null || order.getName().trim().isEmpty()) {
            throw new RuntimeException("菜品名称不能为空");
        }
        if (order.getUserId() == null || order.getUserId().trim().isEmpty()) {
            throw new RuntimeException("用户ID不能为空");
        }
        if (order.getQuantity() == null || order.getQuantity() <= 0) {
            throw new RuntimeException("商品数量必须大于0");
        }
        
        // 验证菜品是否在菜单中且可用
        var dish = dishRepository.findByDishNameAndIsAvailable(order.getName(), true)
                .orElseThrow(() -> new RuntimeException("菜品 '" + order.getName() + "' 不在菜单中或暂时不可用"));
        
        // 使用菜品表中的价格和类型
        order.setPrice(dish.getPrice());
        order.setOrderType(dish.getDishType());
        
        // 设置预计制作时间
        if (dish.getEstimatedTime() != null) {
            order.setEstimatedTime(dish.getEstimatedTime());
        }
        
        // 生成取餐码
        String pickupCode = generatePickupCode();
        
        // 设置订单基本信息
        order.setPickupCode(pickupCode);
        order.setCreatedAt(new Date());
        order.setUpdatedAt(new Date());
        
        // 保存订单并加入队列
        Order savedOrder = createOrder(order);
        orderQueueService.addToQueue(savedOrder);
        
        // 发送新订单通知
        notificationService.notifyNewOrder(savedOrder);
        
        return pickupCode;
    }
    
    /**
     * 生成6位数字取餐码
     */
    private String generatePickupCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 生成100000-999999之间的随机数
        return String.valueOf(code);
    }

}