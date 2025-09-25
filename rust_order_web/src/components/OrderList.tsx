import type { OrderListModel } from '../type/order'
import OrderCard from './OrderCard'
import { Card, CardHeader, CardBody } from '@heroui/react';

interface OrderListProps {
    orders: OrderListModel;
    onOrderUpdate?: () => void;
}

function OrderList({orders, onOrderUpdate}: OrderListProps) {
    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader className="pb-4">
                    <div className="flex flex-col items-center w-full">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>总订单: {orders.length}</span>
                            <span>•</span>
                            <span>实时更新</span>
                        </div>
                    </div>
                </CardHeader>
                
                <CardBody className="pt-0">
                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无订单</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                当前没有待处理的订单，新订单将会自动显示在这里
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {orders.map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    onOrderUpdate={onOrderUpdate}
                                />
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

export default OrderList;