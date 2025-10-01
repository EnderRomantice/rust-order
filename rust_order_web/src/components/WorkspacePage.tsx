import { useState, useEffect, useCallback } from 'react';
import { res } from '../utils/res';
import type { OrderListModel, WorkspacePageProps } from '../types';
import OrderList from './OrderList';
import ActivityIndicator from './ActivityIndicator';
import { useSmartRefresh } from '../hooks/useUserActivity';
import { Button, Spinner } from "@heroui/react";

const WorkspacePage = ({ onOrderUpdate }: WorkspacePageProps) => {
  const [orderList, setOrderList] = useState<OrderListModel>([]);
  const [loading, setLoading] = useState(true);

  const getOrderList = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setLoading(true);
      }
      const data = await res('GET', '/api/admin/orders/queue');
      if (data) setOrderList(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (isManualRefresh) {
        setLoading(false);
      }
    }
  }, []);

  const { isUserActive, manualRefresh } = useSmartRefresh(
    () => getOrderList(false),
    30000,
    3000
  );

  useEffect(() => {
    getOrderList(true);
  }, []);

  const handleOrderUpdate = () => {
    manualRefresh();
    onOrderUpdate?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" color="primary" />
          <p className="text-gray-600 text-lg">加载订单数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">工作区</h1>
          <p className="text-gray-600 mt-1">当前未处理订单队列</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="flat"
            color="primary"
            onPress={() => getOrderList(true)}
            isLoading={loading}
          >
            刷新订单
          </Button>
        </div>
      </div>

      {/* 活动状态指示器 */}
      <ActivityIndicator isUserActive={isUserActive} />

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">待处理订单</p>
              <p className="text-2xl font-bold text-gray-900">{orderList.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">平均等待时间</p>
              <p className="text-2xl font-bold text-gray-900">
                {orderList.length > 0 
                  ? Math.round(orderList.reduce((acc, order) => acc + (order.totalEstimatedTime || 0), 0) / orderList.length)
                  : 0
                } 分钟
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总金额</p>
              <p className="text-2xl font-bold text-gray-900">
                ¥{orderList.reduce((acc, order) => acc + (order.totalPrice || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        <div className="p-6 border-b border-gray-200/50">
          <h2 className="text-lg font-semibold text-gray-900">订单队列</h2>
        </div>
        <div>
          {orderList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无待处理订单</h3>
              <p className="text-gray-600">当前没有需要处理的订单</p>
            </div>
          ) : (
            <OrderList orders={orderList} onOrderUpdate={handleOrderUpdate} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;