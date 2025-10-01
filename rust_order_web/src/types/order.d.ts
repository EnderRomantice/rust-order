type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

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

type OrderListModel = OrderModel[];

export { 
  OrderStatus,
  OrderItemModel, 
  OrderModel, 
  CreateOrderRequest, 
  CreateOrderItemRequest, 
  OrderListModel 
}