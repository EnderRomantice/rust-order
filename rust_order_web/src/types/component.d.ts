// 组件Props相关类型定义

// TabBar组件Props
interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// WorkspacePage组件Props
interface WorkspacePageProps {
  onOrderUpdate?: () => void;
}

// OrderList组件Props
interface OrderListProps {
  orders: import('./order').OrderListModel;
  onOrderUpdate?: () => void;
}

// OrderCard组件Props
interface OrderCardProps {
  order: import('./order').OrderModel;
  onOrderUpdate?: () => void;
}

// ActivityIndicator组件Props
interface ActivityIndicatorProps {
  isUserActive: boolean;
  className?: string;
}

// CreateOrder组件Props
interface CreateOrderProps {
  onOrderCreated?: () => void;
}

export {
  TabBarProps,
  WorkspacePageProps,
  OrderListProps,
  OrderCardProps,
  ActivityIndicatorProps,
  CreateOrderProps
}