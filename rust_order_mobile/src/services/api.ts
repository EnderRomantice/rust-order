// API 服务模块 - 封装所有后端接口调用

// 根据平台自动选择合适的API地址
const getBaseUrl = () => {
  // // 在Web环境下使用localhost
  // if (typeof window !== 'undefined') {
  //   return 'http://localhost:8080';
  // }
  // 在移动端环境下使用开发机器的IP地址
  return 'http://192.168.101.131:8080';
};

const BASE_URL = getBaseUrl();

// 数据类型定义
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

export interface CartItem {
  name: string;
  orderType: string;
  price: number;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
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

// 错误处理工具
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

// 通用API服务类 - 单例模式
export class ApiService {
  private static instance: ApiService;
  
  private constructor() {}
  
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // 通用请求方法
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    console.log(`[API Request] ${options.method || 'GET'} ${url}`);
    
    const defaultOptions: RequestInit = {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      
      console.log(`[API Response] ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API Error] ${response.status}: ${errorText}`);
        throw new APIError(
          `请求失败: ${response.status} ${response.statusText}`,
          response.status,
          errorText
        );
      }

      const data = await response.json();
      console.log(`[API Success] Data received:`, data);
      return data;
    } catch (error) {
      console.error(`[API Error] Request failed:`, error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new APIError('网络连接失败，请检查网络设置', 0);
      }
      
      if (error instanceof APIError) {
        throw error;
      }
      
      throw new APIError('请求失败，请稍后重试', 500, error);
    }
  }

  // GET 请求
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 请求
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 请求
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// 创建全局API服务实例
export const apiService = ApiService.getInstance();

// 原有的request函数保持兼容性
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return apiService.request<T>(endpoint, options);
}

// 菜品相关 API
export const dishAPI = {
  // 获取所有菜品
  getAllDishes: async (): Promise<Dish[]> => {
    try {
      return await apiService.get<Dish[]>('/api/dishes');
    } catch (error) {
      console.error('Failed to fetch dishes:', error);
      throw new APIError('获取菜品列表失败', 500);
    }
  },

  // 根据类型获取菜品
  getDishesByType: async (dishType: string): Promise<Dish[]> => {
    try {
      return await apiService.get<Dish[]>(`/api/dishes?type=${encodeURIComponent(dishType)}`);
    } catch (error) {
      console.error('Failed to fetch dishes by type:', error);
      throw new APIError('获取菜品分类失败', 500);
    }
  },

  // 根据ID获取菜品详情
  getDishById: async (id: number): Promise<Dish> => {
    try {
      return await apiService.get<Dish>(`/api/dishes/${id}`);
    } catch (error) {
      console.error('Failed to fetch dish by id:', error);
      throw new APIError('获取菜品详情失败', 500);
    }
  },

  // 获取热门菜品 - 修改为返回前3个
  getPopularDishes: async (limit: number = 3): Promise<Dish[]> => {
    try {
      const allDishes = await apiService.get<Dish[]>('/api/dishes');
      // 返回前N个可用菜品（默认3个）
      return allDishes.filter(dish => dish.isAvailable).slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch popular dishes:', error);
      throw new APIError('获取热门菜品失败', 500);
    }
  },
};

// 购物车相关 API
export const cartAPI = {
  // 获取购物车
  getCart: async (userId: string): Promise<Cart> => {
    try {
      return await apiService.get<Cart>(`/api/cart/${encodeURIComponent(userId)}`);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      throw new APIError('获取购物车失败', 500);
    }
  },

  // 添加商品到购物车
  addToCart: async (userId: string, item: CartItem): Promise<Cart> => {
    try {
      return await apiService.post<Cart>(`/api/cart/${encodeURIComponent(userId)}/add`, item);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw new APIError('添加到购物车失败', 500);
    }
  },

  // 更新购物车商品数量
  updateCartItem: async (userId: string, itemName: string, quantity: number): Promise<Cart> => {
    try {
      return await apiService.put<Cart>(`/api/cart/${encodeURIComponent(userId)}/update`, { name: itemName, quantity });
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw new APIError('更新购物车商品失败', 500);
    }
  },

  // 从购物车移除商品
  removeFromCart: async (userId: string, itemName: string): Promise<Cart> => {
    try {
      return await apiService.delete<Cart>(`/api/cart/${encodeURIComponent(userId)}/remove/${encodeURIComponent(itemName)}`);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw new APIError('从购物车移除商品失败', 500);
    }
  },

  // 清空购物车
  clearCart: async (userId: string): Promise<{ message: string }> => {
    try {
      return await apiService.delete<{ message: string }>(`/api/cart/${encodeURIComponent(userId)}/clear`);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw new APIError('清空购物车失败', 500);
    }
  },
};

// 订单相关 API
export const orderAPI = {
  // 创建订单
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    try {
      return await apiService.post<Order>('/api/orders', orderData);
    } catch (error) {
      console.error('Failed to create order:', error);
      throw new APIError('创建订单失败', 500);
    }
  },

  // 获取用户所有订单
  getUserOrders: async (userId: string): Promise<Order[]> => {
    try {
      return await apiService.get<Order[]>(`/api/orders/user/${encodeURIComponent(userId)}`);
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      throw new APIError('获取订单列表失败', 500);
    }
  },

  // 根据取餐码获取订单
  getOrderByPickupCode: async (pickupCode: string): Promise<Order> => {
    try {
      return await apiService.get<Order>(`/api/orders/pickup/${encodeURIComponent(pickupCode)}`);
    } catch (error) {
      console.error('Failed to fetch order by pickup code:', error);
      throw new APIError('取餐码无效或订单不存在', 404);
    }
  },

  // 获取单个订单详情
  getOrderById: async (orderId: number): Promise<Order> => {
    try {
      return await apiService.get<Order>(`/api/orders/${orderId}`);
    } catch (error) {
      console.error('Failed to fetch order by id:', error);
      throw new APIError('获取订单详情失败', 500);
    }
  },

  // 更新订单状态
  updateOrderStatus: async (orderId: number, status: Order['orderStatus']): Promise<Order> => {
    try {
      return await apiService.put<Order>(`/api/orders/${orderId}/status`, { status });
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw new APIError('更新订单状态失败', 500);
    }
  },

  // 取消订单
  cancelOrder: async (orderId: number): Promise<Order> => {
    try {
      return await apiService.put<Order>(`/api/orders/${orderId}/cancel`);
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw new APIError('取消订单失败', 500);
    }
  },

  // 确认取餐
  confirmPickup: async (orderId: number): Promise<Order> => {
    try {
      return await apiService.put<Order>(`/api/orders/${orderId}/pickup`);
    } catch (error) {
      console.error('Failed to confirm pickup:', error);
      throw new APIError('确认取餐失败', 500);
    }
  },

  // 获取正在制作的订单
  getActiveOrders: async (userId: string): Promise<Order[]> => {
    try {
      return await apiService.get<Order[]>(`/api/orders/user/${encodeURIComponent(userId)}/active`);
    } catch (error) {
      console.error('Failed to fetch active orders:', error);
      throw new APIError('获取活跃订单失败', 500);
    }
  },

  // 获取历史订单
  getHistoryOrders: async (userId: string): Promise<Order[]> => {
    try {
      return await apiService.get<Order[]>(`/api/orders/user/${encodeURIComponent(userId)}/history`);
    } catch (error) {
      console.error('Failed to fetch history orders:', error);
      throw new APIError('获取历史订单失败', 500);
    }
  },
};

// 统计相关 API
export const statsAPI = {
  // 获取今日销售统计
  getTodayStats: async (): Promise<{
    totalOrders: number;
    totalRevenue: number;
    popularDishes: Array<{ name: string; count: number }>;
  }> => {
    try {
      return await apiService.get('/api/stats/today');
    } catch (error) {
      console.error('Failed to fetch today stats:', error);
      throw new APIError('获取今日统计失败', 500);
    }
  },

  // 获取本周销售统计
  getWeeklyStats: async (): Promise<{
    totalOrders: number;
    totalRevenue: number;
    dailyStats: Array<{ date: string; orders: number; revenue: number }>;
  }> => {
    try {
      return await apiService.get('/api/stats/weekly');
    } catch (error) {
      console.error('Failed to fetch weekly stats:', error);
      throw new APIError('获取本周统计失败', 500);
    }
  },

  // 获取热门菜品
  getPopularDishes: async (limit?: number): Promise<Array<{ dish: Dish; orderCount: number }>> => {
    try {
      const params = limit ? `?limit=${limit}` : '';
      return await apiService.get(`/api/stats/popular-dishes${params}`);
    } catch (error) {
      console.error('Failed to fetch popular dishes:', error);
      throw new APIError('获取热门菜品失败', 500);
    }
  },
};

// 网络状态检查
export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// 导出所有 API
export default {
  dish: dishAPI,
  cart: cartAPI,
  order: orderAPI,
  stats: statsAPI,
  checkNetworkStatus,
};