// 统一的类型定义文件

// 基础数据类型
export interface Dish {
  id: number;
  dishName: string;
  dishType: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  estimatedTime: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 购物车相关类型
export interface CartItem {
  id: number;
  dishName: string;
  dishType: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  notes?: string;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  userId: string;
}

// API 购物车类型（与后端接口对应）
export interface ApiCartItem {
  name: string;
  orderType: string;
  price: number;
  quantity: number;
}

export interface ApiCart {
  userId: string;
  items: ApiCartItem[];
  totalPrice: number;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
}

// 订单相关类型
export interface OrderItem {
  id: number;
  dishName: string;
  dishType: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  estimatedTime: number;
  itemNotes: string;
}

export interface Order {
  id: number;
  userId: string;
  pickupCode: string;
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  queueNumber: number;
  notes: string;
  totalPrice: number;
  totalEstimatedTime: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  userId: string;
  notes: string;
  items: {
    dishName: string;
    dishType: string;
    unitPrice: number;
    quantity: number;
    estimatedTime: number;
    itemNotes: string;
  }[];
}

// 组件 Props 类型
export interface DraggableCartProps {
  visible: boolean;
  cartItems: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onSubmitOrder: () => void;
  onIncreaseQuantity: (itemId: number) => void;
  onDecreaseQuantity: (itemId: number) => void;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  textStyle?: any;
  color?: string;
}

export interface BadgeProps {
  count: number;
  maxCount?: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  textColor?: string;
  style?: any;
  textStyle?: any;
  showZero?: boolean;
  dot?: boolean;
}

export interface TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled';
  style?: any;
  inputStyle?: any;
  labelStyle?: any;
  required?: boolean;
}

// 统计相关类型
export interface TodayStats {
  totalOrders: number;
  totalRevenue: number;
  popularDishes: Array<{ name: string; count: number }>;
}

export interface WeeklyStats {
  totalOrders: number;
  totalRevenue: number;
  dailyStats: Array<{ date: string; orders: number; revenue: number }>;
}

// API 错误类型
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}