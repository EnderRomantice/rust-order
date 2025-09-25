import { useState, useEffect } from 'react';
import { res } from '../utils/res';
import type { OrderListModel } from '../type/order';
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Spinner, 
  Chip,
  Select,
  SelectItem,
  Input
} from "@heroui/react";

const HistoryOrdersPage = () => {
  const [orders, setOrders] = useState<OrderListModel>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const orderStatuses = [
    { key: 'COMPLETED', label: '已完成', color: 'success' as const },
    { key: 'CANCELLED', label: '已取消', color: 'danger' as const },
    { key: 'READY', label: '待取餐', color: 'warning' as const }
  ];

  const getHistoryOrders = async () => {
    try {
      setLoading(true);
      // 获取所有订单
      const allOrders = await res('GET', '/api/orders');
      
      // 筛选历史订单（已完成、已取消、待取餐）
      const historyOrders = (allOrders || []).filter((order: any) => 
        ['COMPLETED', 'CANCELLED', 'READY'].includes(order.orderStatus)
      ).sort((a: any, b: any) => 
        new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      );
      
      setOrders(historyOrders);
    } catch (err) {
      console.error('获取历史订单失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistoryOrders();
  }, []);

  const getStatusColor = (status: string) => {
    const statusInfo = orderStatuses.find(s => s.key === status);
    return statusInfo?.color || 'default';
  };

  const getStatusLabel = (status: string) => {
    const statusInfo = orderStatuses.find(s => s.key === status);
    return statusInfo?.label || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order.pickupCode?.includes(searchTerm) ||
      order.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => item.dishName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = orders
    .filter(order => order.orderStatus === 'COMPLETED')
    .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const completedCount = orders.filter(order => order.orderStatus === 'COMPLETED').length;
  const cancelledCount = orders.filter(order => order.orderStatus === 'CANCELLED').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" color="primary" />
          <p className="text-gray-600 text-lg">加载历史订单中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">历史订单</h1>
          <p className="text-gray-600 mt-1">查看已完成和已取消的订单</p>
        </div>
        <Button
          variant="flat"
          color="primary"
          onPress={getHistoryOrders}
          isLoading={loading}
        >
          刷新
        </Button>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总订单数</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">已完成</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">已取消</p>
              <p className="text-2xl font-bold text-gray-900">{cancelledCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总收入</p>
              <p className="text-2xl font-bold text-gray-900">¥{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜索订单（取餐码、用户ID、菜品名称）"
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              placeholder="筛选状态"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                setStatusFilter(selectedKey);
              }}
            >
              <SelectItem key="all" value="all">全部状态</SelectItem>
              {orderStatuses.map((status) => (
                <SelectItem key={status.key} value={status.key}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 border border-gray-200/50 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无历史订单</h3>
            <p className="text-gray-600">没有找到符合条件的订单</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">订单 #{order.id}</h3>
                      <Chip 
                        color={getStatusColor(order.orderStatus)} 
                        variant="flat" 
                        size="sm"
                      >
                        {getStatusLabel(order.orderStatus)}
                      </Chip>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      取餐码: {order.pickupCode} | 用户: {order.userId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">¥{order.totalPrice?.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.updatedAt || order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <span className="font-medium text-gray-900">{item.dishName}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        {item.itemNotes && (
                          <p className="text-sm text-gray-600 mt-1">备注: {item.itemNotes}</p>
                        )}
                      </div>
                      <span className="text-gray-700">¥{item.subtotal?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                {order.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">订单备注:</span> {order.notes}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryOrdersPage;