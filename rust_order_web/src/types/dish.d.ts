interface Dish {
  id: number;
  dishName: string;
  dishType: string;
  price: number;
  estimatedTime: number;
}

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

interface OrderItem {
  dish: Dish;
  quantity: number;
}

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