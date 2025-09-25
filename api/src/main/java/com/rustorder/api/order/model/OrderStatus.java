package com.rustorder.api.order.model;

public enum OrderStatus {
    PENDING("待处理", "订单已提交，等待后台处理"),
    CONFIRMED("已确认", "订单已确认，准备制作"),
    PREPARING("制作中", "正在制作中"),
    READY("待取餐", "制作完成，等待取餐"),
    COMPLETED("已完成", "订单已完成"),
    CANCELLED("已取消", "订单已取消");
    
    private final String displayName;
    private final String description;
    
    OrderStatus(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * 根据显示名称获取枚举值
     */
    public static OrderStatus fromDisplayName(String displayName) {
        for (OrderStatus status : values()) {
            if (status.displayName.equals(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown order status: " + displayName);
    }
    
    /**
     * 检查是否可以转换到目标状态
     */
    public boolean canTransitionTo(OrderStatus targetStatus) {
        switch (this) {
            case PENDING:
                return targetStatus == CONFIRMED || targetStatus == CANCELLED;
            case CONFIRMED:
                return targetStatus == PREPARING || targetStatus == CANCELLED;
            case PREPARING:
                return targetStatus == READY || targetStatus == CANCELLED;
            case READY:
                return targetStatus == COMPLETED;
            case COMPLETED:
            case CANCELLED:
                return false; // 终态，不能再转换
            default:
                return false;
        }
    }
    
    /**
     * 获取下一个可能的状态列表
     */
    public OrderStatus[] getNextPossibleStatuses() {
        switch (this) {
            case PENDING:
                return new OrderStatus[]{CONFIRMED, CANCELLED};
            case CONFIRMED:
                return new OrderStatus[]{PREPARING, CANCELLED};
            case PREPARING:
                return new OrderStatus[]{READY, CANCELLED};
            case READY:
                return new OrderStatus[]{COMPLETED};
            case COMPLETED:
            case CANCELLED:
                return new OrderStatus[]{}; // 终态
            default:
                return new OrderStatus[]{};
        }
    }
}