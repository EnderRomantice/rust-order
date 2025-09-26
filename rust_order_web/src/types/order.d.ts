// 订单相关类型定义

// 订单状态类型
type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

// 订单项类型定义
interface OrderItemModel {
  id: number;
  dishName: string;
  dishType: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  estimatedTime: number;
  itemNotes?: string;
}

// 订单类型定义
interface OrderModel {
  id: number;
  userId: string;
  pickupCode: string;
  orderStatus: OrderStatus;
  queueNumber: number;
  notes?: string;
  totalPrice: number;
  totalEstimatedTime: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItemModel[];
}

// 创建订单请求类型
interface CreateOrderItemRequest {
  dishName: string;
  dishType: string;
  unitPrice: number;
  quantity: number;
  estimatedTime: number;
  itemNotes?: string;
}

interface CreateOrderRequest {
  userId: string;
  notes?: string;
  items: CreateOrderItemRequest[];
}

// 订单列表类型（现在是简单的数组，不再按取餐码分组）
type OrderListModel = OrderModel[];

export { 
  OrderStatus,
  OrderItemModel, 
  OrderModel, 
  CreateOrderRequest, 
  CreateOrderItemRequest, 
  OrderListModel 
}