import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, LoadingSpinner } from '@/src/components';
import { orderAPI, type Order } from '@/src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDER_STATUS_MAP = {
  PENDING: { text: '待处理', color: '#F7931E' },
  CONFIRMED: { text: '已确认', color: '#1DA1F2' },
  PREPARING: { text: '制作中', color: '#F91880' },
  READY: { text: '待取餐', color: '#17BF63' },
  COMPLETED: { text: '已完成', color: '#657786' },
  CANCELLED: { text: '已取消', color: '#E0245E' },
};

export default function PickupScreen() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // 获取用户ID
  useEffect(() => {
    const getUserId = async () => {
      try {
        let storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          // 如果没有用户ID，生成一个临时的
          storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await AsyncStorage.setItem('userId', storedUserId);
        }
        setUserId(storedUserId);
      } catch (error) {
        console.error('获取用户ID失败:', error);
        // 使用临时ID
        const tempUserId = `temp_${Date.now()}`;
        setUserId(tempUserId);
      }
    };
    getUserId();
  }, []);

  // 加载订单数据
  useEffect(() => {
    if (userId) {
      loadOrders();
    }
  }, [userId]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await orderAPI.getUserOrders(userId);
      setOrders(userOrders);
    } catch (error) {
      console.error('加载订单失败:', error);
      Alert.alert('错误', '加载订单失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    try {
      setRefreshing(true);
      const userOrders = await orderAPI.getUserOrders(userId);
      setOrders(userOrders);
    } catch (error) {
      console.error('刷新订单失败:', error);
      Alert.alert('错误', '刷新订单失败，请稍后重试');
    } finally {
      setRefreshing(false);
    }
  };

  const currentOrders = orders.filter(order => 
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(order.orderStatus)
  );

  const historyOrders = orders.filter(order => 
    ['COMPLETED', 'CANCELLED'].includes(order.orderStatus)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const confirmPickup = (order: any) => {
    setSelectedOrder(order);
    setPickupModalVisible(true);
  };

  const handlePickupConfirm = async () => {
    if (selectedOrder) {
      try {
        await orderAPI.confirmPickup(selectedOrder.id);
        setPickupModalVisible(false);
        setSelectedOrder(null);
        Alert.alert('成功', '取餐完成！');
        // 刷新订单列表
        await refreshOrders();
      } catch (error) {
        console.error('确认取餐失败:', error);
        Alert.alert('错误', '确认取餐失败，请稍后重试');
      }
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const statusInfo = ORDER_STATUS_MAP[item.orderStatus as keyof typeof ORDER_STATUS_MAP];
    const isReady = item.orderStatus === 'READY';

    return (
      <Card style={styles.orderItem}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.pickupCode}>取餐码: {item.pickupCode}</Text>
            <Text style={styles.orderTime}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>

        {item.orderStatus === 'PREPARING' && (
          <View style={styles.queueInfo}>
            <Ionicons name="time-outline" size={16} color="#F91880" />
            <Text style={styles.queueText}>前面还有 {item.queueNumber} 单</Text>
          </View>
        )}

        <View style={styles.orderItems}>
          {item.items.map((orderItem: any, index: number) => (
            <Text key={index} style={styles.orderItemText}>
              {orderItem.dishName} x{orderItem.quantity}
            </Text>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalPrice}>总计: ¥{item.totalPrice.toFixed(2)}</Text>
          {isReady && (
            <Button
              title="确认取餐"
              onPress={() => confirmPickup(item)}
              variant="filled"
              color="#17BF63"
              style={styles.pickupButton}
            />
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的订单</Text>
      </View>

      {/* 标签切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>
            正在制作
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            历史订单
          </Text>
        </TouchableOpacity>
      </View>

      {/* 订单列表 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DA1F2" />
          <Text style={styles.loadingText}>加载订单中...</Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'current' ? currentOrders : historyOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id.toString()}
          style={styles.orderList}
          contentContainerStyle={styles.orderListContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refreshOrders}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons 
                name={activeTab === 'current' ? 'restaurant-outline' : 'receipt-outline'} 
                size={64} 
                color="#BDBDBD" 
              />
              <Text style={styles.emptyText}>
                {activeTab === 'current' ? '暂无正在制作的订单' : '暂无历史订单'}
              </Text>
            </View>
          }
        />
      )}

      {/* 取餐确认弹窗 */}
      <Modal
        visible={pickupModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPickupModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>确认取餐</Text>
              <TouchableOpacity onPress={() => setPickupModalVisible(false)}>
                <Ionicons name="close" size={24} color="#757575" />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <View style={styles.modalBody}>
                <View style={styles.pickupCodeDisplay}>
                  <Text style={styles.pickupCodeLabel}>取餐码</Text>
                  <Text style={styles.pickupCodeLarge}>{selectedOrder.pickupCode}</Text>
                </View>

                <View style={styles.orderSummary}>
                  <Text style={styles.summaryTitle}>订单详情</Text>
                  {selectedOrder.items.map((item: any, index: number) => (
                    <View key={index} style={styles.summaryItem}>
                      <Text style={styles.summaryItemName}>{item.dishName}</Text>
                      <Text style={styles.summaryItemQuantity}>x{item.quantity}</Text>
                      <Text style={styles.summaryItemPrice}>¥{(item.unitPrice * item.quantity).toFixed(2)}</Text>
                    </View>
                  ))}
                  <View style={styles.summaryTotal}>
                    <Text style={styles.summaryTotalText}>总计: ¥{selectedOrder.totalPrice.toFixed(2)}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handlePickupConfirm}
                >
                  <Text style={styles.confirmButtonText}>确认已取餐</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1DA1F2',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1DA1F2',
    fontWeight: '700',
  },
  orderList: {
    flex: 1,
  },
  orderListContent: {
    padding: 16,
  },
  orderItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  pickupCode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  orderTime: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  queueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F91880',
  },
  queueText: {
    fontSize: 14,
    color: '#F91880',
    marginLeft: 6,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  orderItemText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1DA1F2',
  },
  pickupButton: {
    backgroundColor: '#17BF63',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#17BF63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pickupButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 20,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxHeight: '85%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  modalBody: {
    padding: 24,
  },
  pickupCodeDisplay: {
    alignItems: 'center',
    marginBottom: 28,
    padding: 24,
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFE0B2',
  },
  pickupCodeLabel: {
    fontSize: 16,
    color: '#F91880',
    marginBottom: 12,
    fontWeight: '600',
  },
  pickupCodeLarge: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F91880',
    letterSpacing: 6,
  },
  orderSummary: {
    marginBottom: 28,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  summaryItemName: {
    flex: 1,
    fontSize: 15,
    color: '#495057',
    fontWeight: '500',
  },
  summaryItemQuantity: {
    fontSize: 14,
    color: '#6C757D',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  summaryItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1DA1F2',
  },
  summaryTotal: {
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#DEE2E6',
    marginTop: 12,
  },
  summaryTotalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'right',
  },
  confirmButton: {
    backgroundColor: '#17BF63',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#17BF63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});