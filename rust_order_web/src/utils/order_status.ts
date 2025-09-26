import type { OrderStatus } from "../types";

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED', 
    PREPARING: 'PREPARING',
    READY: 'READY',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const;

interface StatusConfig {
    label: string;
    action?: {
        text: string;
        endpoint: string;
    };
}

const statusConfigMap: Record<OrderStatus, StatusConfig> = {
    [ORDER_STATUS.PENDING]: {
        label: '待确认',
        action: { text: '确认', endpoint: 'confirm' }
    },
    [ORDER_STATUS.CONFIRMED]: {
        label: '已确认',
        action: { text: '开始', endpoint: 'start' }
    },
    [ORDER_STATUS.PREPARING]: {
        label: '正在准备',
        action: { text: '完成', endpoint: 'ready' }
    },
    [ORDER_STATUS.READY]: {
        label: '已准备',
        action: { text: '取餐', endpoint: 'complete' }
    },
    [ORDER_STATUS.COMPLETED]: {
        label: '已完成'
    },
    [ORDER_STATUS.CANCELLED]: {
        label: '已取消'
    },
};

export function getStatusLabel(orderStatus: OrderStatus): string {
    return statusConfigMap[orderStatus]?.label || "不存在的状态";
}

export function getStatusAction(orderStatus: OrderStatus) {
    return statusConfigMap[orderStatus]?.action || null;
}

export function getStatusConfig(orderStatus: OrderStatus): StatusConfig {
    return statusConfigMap[orderStatus] || { label: "不存在的状态" };
}

// 保持向后兼容
function status(orderStatus: OrderStatus) {
    return getStatusLabel(orderStatus);
}

export default status;