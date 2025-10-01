// 购物车状态管理和本地存储
import { Platform } from 'react-native';
import { CartItem, CartState } from '../types';

// 条件导入AsyncStorage，避免在web环境中出错
let AsyncStorage: any = null;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

// 购物车存储键
const CART_STORAGE_KEY = '@rust_order_cart';
const USER_ID_KEY = '@rust_order_user_id';

// 生成用户ID（简单实现）
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 购物车管理类
class CartStore {
  private state: CartState = {
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
    userId: '',
  };

  private listeners: Array<(state: CartState) => void> = [];

  public initialized = false;

  constructor() {
    // 延迟初始化，避免在服务器端渲染时出错
  }

  // 初始化购物车
  private async initializeCart() {
    try {
      // Web环境兼容性检查
      if (Platform.OS === 'web') {
        if (typeof window === 'undefined') {
          // 服务器端渲染环境，设置默认值
          this.state.userId = 'web-user-default';
          this.initialized = true;
          return;
        } else {
          // 客户端web环境，使用localStorage
          let userId = localStorage.getItem(USER_ID_KEY);
          if (!userId) {
            userId = generateUserId();
            localStorage.setItem(USER_ID_KEY, userId);
          }

          const cartData = localStorage.getItem(CART_STORAGE_KEY);
          if (cartData) {
            const parsedCart = JSON.parse(cartData);
            this.state = {
              ...parsedCart,
              userId,
            };
          } else {
            this.state.userId = userId;
          }
        }
      } else {
        // React Native环境，使用AsyncStorage
        let userId = await AsyncStorage.getItem(USER_ID_KEY);
        if (!userId) {
          userId = generateUserId();
          await AsyncStorage.setItem(USER_ID_KEY, userId);
        }

        const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (cartData) {
          const parsedCart = JSON.parse(cartData);
          this.state = {
            ...parsedCart,
            userId,
          };
        } else {
          this.state.userId = userId;
        }
      }

      this.calculateTotals();
      this.initialized = true;
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to initialize cart:', error);
      // 即使失败也设置默认值并标记为已初始化
      this.state.userId = generateUserId();
      this.initialized = true;
    }
  }

  // 确保初始化完成
  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeCart();
    }
  }

  // 计算总价和总数量
  private calculateTotals() {
    this.state.totalPrice = this.state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    this.state.totalQuantity = this.state.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  // 保存到本地存储
  private async saveToStorage() {
    try {
      // Web环境兼容性检查
      if (Platform.OS === 'web') {
        if (typeof window === 'undefined') {
          // 服务器端渲染环境，跳过存储
          return;
        } else {
          // 客户端web环境，使用localStorage
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.state));
        }
      } else {
        // React Native环境，使用AsyncStorage
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  // 通知监听器
  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  // 添加监听器
  subscribe(listener: (state: CartState) => void): () => void {
    this.listeners.push(listener);
    
    // 返回取消订阅函数
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 获取当前状态
  getState(): CartState {
    // 如果还未初始化，触发初始化并返回当前状态（可能包含已有数据）
    if (!this.initialized) {
      // 异步初始化，但返回当前状态而不是空状态
      this.initializeCart().catch(console.error);
    }
    return { ...this.state };
  }

  // 获取用户ID
  getUserId(): string {
    return this.state.userId;
  }

  // 添加商品到购物车
  async addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
    await this.ensureInitialized();
    
    const existingItemIndex = this.state.items.findIndex(
      cartItem => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      // 如果商品已存在，增加数量
      this.state.items[existingItemIndex].quantity += quantity;
    } else {
      // 如果商品不存在，添加新商品
      this.state.items.push({
        ...item,
        quantity,
      });
    }

    this.calculateTotals();
    await this.saveToStorage();
    this.notifyListeners();
  }

  // 更新商品数量
  async updateItemQuantity(itemId: number, quantity: number) {
    await this.ensureInitialized();
    
    if (quantity <= 0) {
      await this.removeItem(itemId);
      return;
    }

    const itemIndex = this.state.items.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      this.state.items[itemIndex].quantity = quantity;
      this.calculateTotals();
      await this.saveToStorage();
      this.notifyListeners();
    }
  }

  // 移除商品
  async removeItem(itemId: number) {
    await this.ensureInitialized();
    
    this.state.items = this.state.items.filter(item => item.id !== itemId);
    this.calculateTotals();
    await this.saveToStorage();
    this.notifyListeners();
  }

  // 减少商品数量
  async decreaseItemQuantity(itemId: number) {
    await this.ensureInitialized();
    
    const item = this.state.items.find(item => item.id === itemId);
    if (item) {
      if (item.quantity > 1) {
        await this.updateItemQuantity(itemId, item.quantity - 1);
      } else {
        await this.removeItem(itemId);
      }
    }
  }

  // 增加商品数量
  async increaseItemQuantity(itemId: number) {
    await this.ensureInitialized();
    
    const item = this.state.items.find(item => item.id === itemId);
    if (item) {
      await this.updateItemQuantity(itemId, item.quantity + 1);
    }
  }

  // 清空购物车
  async clearCart() {
    await this.ensureInitialized();
    
    this.state.items = [];
    this.calculateTotals();
    await this.saveToStorage();
    this.notifyListeners();
  }

  // 获取商品数量
  getItemQuantity(itemId: number): number {
    const item = this.state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  }

  // 检查商品是否在购物车中
  hasItem(itemId: number): boolean {
    return this.state.items.some(item => item.id === itemId);
  }

  // 获取购物车商品数量
  getItemCount(): number {
    return this.state.totalQuantity;
  }

  // 获取购物车总价
  getTotalPrice(): number {
    return this.state.totalPrice;
  }

  // 检查购物车是否为空
  isEmpty(): boolean {
    return this.state.items.length === 0;
  }

  // 更新商品备注
  async updateItemNotes(itemId: number, notes: string) {
    const itemIndex = this.state.items.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      this.state.items[itemIndex].notes = notes;
      await this.saveToStorage();
      this.notifyListeners();
    }
  }

  // 转换为订单格式
  toOrderItems() {
    return this.state.items.map(item => ({
      dishName: item.dishName,
      dishType: item.dishType,
      unitPrice: item.price,
      quantity: item.quantity,
      estimatedTime: 15, // 默认预估时间
      itemNotes: item.notes || '',
    }));
  }
}

// 创建全局购物车实例
export const cartStore = new CartStore();

// React Hook for using cart store
import { useState, useEffect } from 'react';

export const useCartStore = () => {
  // 初始状态使用默认值，避免在服务器端渲染时调用getState
  const [cartState, setCartState] = useState<CartState>(() => {
    // 在web环境且window未定义时，返回默认状态
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return {
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
        userId: '',
      };
    }
    return cartStore.getState();
  });

  useEffect(() => {
    // 只在客户端环境中订阅
    if (Platform.OS !== 'web' || typeof window !== 'undefined') {
      const unsubscribe = cartStore.subscribe(setCartState);
      
      // 确保获取最新状态，并在初始化完成后再次更新
      const updateState = () => {
        setCartState(cartStore.getState());
      };
      
      updateState();
      
      // 如果还未初始化，等待初始化完成后再次更新
      if (!cartStore.initialized) {
        const checkInitialized = () => {
          if (cartStore.initialized) {
            updateState();
          } else {
            setTimeout(checkInitialized, 50);
          }
        };
        setTimeout(checkInitialized, 50);
      }
      
      return unsubscribe;
    }
  }, []);

  return {
    ...cartState,
    addItem: cartStore.addItem.bind(cartStore),
    removeItem: cartStore.removeItem.bind(cartStore),
    updateItemQuantity: cartStore.updateItemQuantity.bind(cartStore),
    decreaseItemQuantity: cartStore.decreaseItemQuantity.bind(cartStore),
    increaseItemQuantity: cartStore.increaseItemQuantity.bind(cartStore),
    clearCart: cartStore.clearCart.bind(cartStore),
    getItemQuantity: cartStore.getItemQuantity.bind(cartStore),
    hasItem: cartStore.hasItem.bind(cartStore),
    updateItemNotes: cartStore.updateItemNotes.bind(cartStore),
    toOrderItems: cartStore.toOrderItems.bind(cartStore),
    getUserId: cartStore.getUserId.bind(cartStore),
  };
};

export default cartStore;