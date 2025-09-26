// 菜品相关类型定义

// 基础菜品类型（用于CreateOrder组件）
interface Dish {
  id: number;
  dishName: string;
  dishType: string;
  price: number;
  estimatedTime: number;
}

// 完整菜品类型（用于MenuManagePage组件）
interface DishModel {
  id: number;
  dishName: string;
  dishType: string;
  price: number;
  description: string;
  imageUrl?: string;
  isAvailable: boolean;
  estimatedTime: number;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 订单项中的菜品类型
interface OrderItem {
  dish: Dish;
  quantity: number;
}

// 菜品卡片组件的Props类型
interface DishCardProps {
  dish: DishModel;
  onToggleAvailability: (dishId: number, isAvailable: boolean) => void;
  isPending: boolean;
}

export { 
  Dish, 
  DishModel, 
  OrderItem, 
  DishCardProps 
}