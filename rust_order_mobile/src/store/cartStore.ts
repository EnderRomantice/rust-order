import { Platform } from 'react-native';
import { CartItem, CartState } from '../types';
import { getUserId as getDeviceBasedUserId } from '../services/deviceId';

let AsyncStorage: any = null;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

const CART_STORAGE_KEY = '@rust_order_cart';
const USER_ID_KEY = '@rust_order_user_id';

const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

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
  }

  private async initializeCart() {
    try {
      let userId: string;
      try {
        userId = await getDeviceBasedUserId();
      } catch (error) {
        console.warn('设备ID服务失败，使用回退方案:', error);
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            userId = localStorage.getItem(USER_ID_KEY) || generateUserId();
            localStorage.setItem(USER_ID_KEY, userId);
          } else {
            userId = 'web-user-default';
          }
        } else {
          userId = await AsyncStorage.getItem(USER_ID_KEY) || generateUserId();
          await AsyncStorage.setItem(USER_ID_KEY, userId);
        }
      }

      let cartData: string | null = null;
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          cartData = localStorage.getItem(CART_STORAGE_KEY);
        }
      } else {
        cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      }

      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        this.state = {
          ...parsedCart,
          userId,
        };
      } else {
        this.state.userId = userId;
      }

      this.calculateTotals();
      this.initialized = true;
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to initialize cart:', error);
      this.state.userId = generateUserId();
      this.initialized = true;
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeCart();
    }
  }

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

  private async saveToStorage() {
    try {
      if (Platform.OS === 'web') {
        if (typeof window === 'undefined') {
          return;
        } else {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.state));
        }
      } else {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  subscribe(listener: (state: CartState) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getState(): CartState {
    if (!this.initialized) {
      this.initializeCart().catch(console.error);
    }
    return { ...this.state };
  }

  getUserId(): string {
    return this.state.userId;
  }

  async addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
    await this.ensureInitialized();
    
    const existingItemIndex = this.state.items.findIndex(
      cartItem => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      this.state.items[existingItemIndex].quantity += quantity;
    } else {
      this.state.items.push({
        ...item,
        quantity,
      });
    }

    this.calculateTotals();
    await this.saveToStorage();
    this.notifyListeners();
  }

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

  async removeItem(itemId: number) {
    await this.ensureInitialized();
    
    this.state.items = this.state.items.filter(item => item.id !== itemId);
    this.calculateTotals();
    await this.saveToStorage();
    this.notifyListeners();
  }

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

  async increaseItemQuantity(itemId: number) {
    await this.ensureInitialized();
    
    const item = this.state.items.find(item => item.id === itemId);
    if (item) {
      await this.updateItemQuantity(itemId, item.quantity + 1);
    }
  }

  async clearCart() {
    await this.ensureInitialized();
    
    this.state.items = [];
    this.calculateTotals();
    await this.saveToStorage();
    this.notifyListeners();
  }

  getItemQuantity(itemId: number): number {
    const item = this.state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  }

  hasItem(itemId: number): boolean {
    return this.state.items.some(item => item.id === itemId);
  }

  getItemCount(): number {
    return this.state.totalQuantity;
  }

  getTotalPrice(): number {
    return this.state.totalPrice;
  }

  isEmpty(): boolean {
    return this.state.items.length === 0;
  }

  async updateItemNotes(itemId: number, notes: string) {
    const itemIndex = this.state.items.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      this.state.items[itemIndex].notes = notes;
      await this.saveToStorage();
      this.notifyListeners();
    }
  }

  toOrderItems() {
    return this.state.items.map(item => ({
      dishName: item.dishName,
      dishType: item.dishType,
      unitPrice: item.price,
      quantity: item.quantity,
      estimatedTime: 15,
      itemNotes: item.notes || '',
    }));
  }
}

export const cartStore = new CartStore();

import { useState, useEffect } from 'react';

export const useCartStore = () => {
  const [cartState, setCartState] = useState<CartState>(() => {
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
    if (Platform.OS !== 'web' || typeof window !== 'undefined') {
      const unsubscribe = cartStore.subscribe(setCartState);
      
      const updateState = () => {
        setCartState(cartStore.getState());
      };
      
      updateState();
      
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