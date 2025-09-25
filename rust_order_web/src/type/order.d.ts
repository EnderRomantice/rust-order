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
  orderStatus: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
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

export { OrderItemModel, OrderModel, CreateOrderRequest, CreateOrderItemRequest, OrderListModel }