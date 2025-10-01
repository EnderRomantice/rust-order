interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface WorkspacePageProps {
  onOrderUpdate?: () => void;
}

interface OrderListProps {
  orders: import('./order').OrderListModel;
  onOrderUpdate?: () => void;
}

interface OrderCardProps {
  order: import('./order').OrderModel;
  onOrderUpdate?: () => void;
}

interface ActivityIndicatorProps {
  isUserActive: boolean;
  className?: string;
}

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