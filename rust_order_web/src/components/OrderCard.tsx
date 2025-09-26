import type { OrderCardProps } from "../types";
import status, { getStatusAction } from "../utils/order_status";
import { res } from "../utils/res";
import {Card, CardHeader, CardBody, CardFooter, Button, Chip, Divider} from "@heroui/react";

function OrderCard({order, onOrderUpdate}: OrderCardProps) {
    
    const handleStatusUpdate = async (action: string) => {
        try {
            await res('POST', `/api/admin/orders/${order.id}/${action}`, {});
            if (onOrderUpdate) onOrderUpdate();
        } catch (error) {
            console.error(error);
            alert(`操作失败: ${action}`);
        }
    };

    const getStatusColor = (orderStatus: string) => {
        switch (orderStatus) {
            case 'PENDING': return 'warning';
            case 'CONFIRMED': return 'primary';
            case 'PREPARING': return 'secondary';
            case 'READY': return 'success';
            case 'COMPLETED': return 'default';
            case 'CANCELLED': return 'danger';
            default: return 'default';
        }
    };

    const getStatusActions = () => {
        const action = getStatusAction(order.orderStatus);
        
        if (action) {
            return (
                <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="font-medium"
                    onClick={() => handleStatusUpdate(action.endpoint)}>
                    {action.text}
                </Button>
            );
        }
        
        return null;
    };

    return (
        <Card className="w-full max-w-sm bg-white/80 backdrop-blur-md border-0 shadow-none transition-all duration-300">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col">
                        <h4 className="text-lg font-semibold text-gray-900">取餐码</h4>
                        <p className="text-2xl font-bold text-blue-600">{order.pickupCode}</p>
                    </div>
                    <Chip 
                        color={getStatusColor(order.orderStatus)}
                        variant="flat"
                        size="sm"
                        className="font-medium"
                    >
                        {status(order.orderStatus)}
                    </Chip>
                </div>
            </CardHeader>
            
            <CardBody className="py-3">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">队列号</span>
                        <span className="font-semibold text-gray-900">#{order.queueNumber}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">预计时间</span>
                        <span className="font-semibold text-orange-600">{order.totalEstimatedTime}分钟</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">总价</span>
                        <span className="font-bold text-green-600 text-lg">¥{order.totalPrice}</span>
                    </div>
                    
                    {order.notes && (
                        <>
                            <Divider className="my-2" />
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">备注</p>
                                <p className="text-sm text-gray-700">{order.notes}</p>
                            </div>
                        </>
                    )}
                    
                    <Divider className="my-2" />
                    
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">订单详情</p>
                        {order.items.map(item => (
                            <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.dishName}</p>
                                        <p className="text-sm text-gray-600">数量: {item.quantity}</p>
                                        {item.itemNotes && (
                                            <p className="text-xs text-gray-500 mt-1">备注: {item.itemNotes}</p>
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-900">¥{item.subtotal}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardBody>
            
            {getStatusActions() && (
                <CardFooter className="pt-2">
                    <div className="w-full">
                        {getStatusActions()}
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}

export default OrderCard;