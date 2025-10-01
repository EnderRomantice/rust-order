import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, Badge } from '@/src/components';
import { useCartStore } from '@/src/store/cartStore';
import { dishAPI, type Dish } from '@/src/services/api';

// 店铺信息
const STORE_INFO = {
  name: '锈蚀餐厅',
  location: '北京市朝阳区xxx街道xxx号',
};

// 菜品分类
const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: '主食', name: '主食' },
  { id: '饮品', name: '饮品' },
  { id: '小食', name: '小食' },
  { id: '甜品', name: '甜品' },
];

interface CartItem {
  id: number;
  dishName: string;
  price: number;
  quantity: number;
}

export default function OrderScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const {
    items: cartItems,
    totalPrice,
    totalQuantity,
    addItem,
    removeItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    getItemQuantity,
  } = useCartStore();

  // 获取菜品数据
  const fetchDishes = async () => {
    try {
      setError(null);
      const data = selectedCategory === 'all' 
        ? await dishAPI.getAllDishes()
        : await dishAPI.getDishesByType(selectedCategory);
      setDishes(data);
    } catch (err: any) {
      setError(err.message || '获取菜品数据失败');
      Alert.alert('错误', err.message || '获取菜品数据失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDishes();
  };

  // 初始化和分类变化时获取数据
  useEffect(() => {
    setLoading(true);
    fetchDishes();
  }, [selectedCategory]);

  const filteredDishes = dishes;

  const handleAddToCart = async (dish: Dish) => {
    await addItem({
      id: dish.id,
      dishName: dish.dishName,
      dishType: dish.dishType,
      price: dish.price,
      imageUrl: dish.imageUrl || 'https://via.placeholder.com/100x100/E0E0E0/757575?text=暂无图片',
    }, 1);
  };

  const handleIncreaseQuantity = async (dishId: number) => {
    await increaseItemQuantity(dishId);
  };

  const handleDecreaseQuantity = async (dishId: number) => {
    await decreaseItemQuantity(dishId);
  };

  const handleSubmitOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('提示', '购物车为空，请先添加商品');
      return;
    }

    Alert.alert(
      '确认订单',
      `确认提交订单吗？\n总计：¥${totalPrice.toFixed(2)}`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确认',
          onPress: async () => {
            try {
              // 这里可以调用API提交订单
              // const orderData = {
              //   items: cartItems,
              //   totalPrice: totalPrice,
              //   storeInfo: STORE_INFO
              // };
              // await orderAPI.submitOrder(orderData);
              
              Alert.alert(
                '订单提交成功',
                '您的订单已提交，请前往取餐页面查看订单状态',
                [
                  {
                    text: '确定',
                    onPress: () => {
                      setCartVisible(false);
                      // 清空购物车
                      // clearCart(); // 如果有这个方法的话
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('提交失败', '订单提交失败，请稍后重试');
            }
          },
        },
      ]
    );
  };

  const renderDishItem = ({ item }: { item: Dish }) => (
    <Card style={styles.dishItem}>
      <Image 
        source={{ 
          uri: item.imageUrl || 'https://via.placeholder.com/100x100/E0E0E0/757575?text=暂无图片' 
        }} 
        style={styles.dishImage} 
      />
      <View style={styles.dishInfo}>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <Text style={styles.dishDescription}>{item.description}</Text>
        <View style={styles.dishMeta}>
          <Text style={styles.dishType}>{item.dishType}</Text>
          {item.estimatedTime && (
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={12} color="#757575" />
              <Text style={styles.timeText}>约{item.estimatedTime}分钟</Text>
            </View>
          )}
        </View>
        <View style={styles.dishFooter}>
          <Text style={styles.dishPrice}>¥{item.price.toFixed(2)}</Text>
          {!item.isAvailable ? (
            <View style={styles.unavailableButton}>
              <Text style={styles.unavailableText}>暂时售罄</Text>
            </View>
          ) : getItemQuantity(item.id) > 0 ? (
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleDecreaseQuantity(item.id)}
              >
                <Ionicons name="remove" size={20} color="#1976D2" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{getItemQuantity(item.id)}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleIncreaseQuantity(item.id)}
              >
                <Ionicons name="add" size={20} color="#1976D2" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemName}>{item.dishName}</Text>
      <View style={styles.cartItemControls}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => decreaseItemQuantity(item.id)}
        >
          <Ionicons name="remove" size={16} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => increaseItemQuantity(item.id)}
        >
          <Ionicons name="add" size={16} color="#2196F3" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cartItemPrice}>¥{(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 门店信息 */}
      <View style={styles.storeHeader}>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{STORE_INFO.name}</Text>
          <Text style={styles.storeLocation}>{STORE_INFO.location}</Text>
        </View>
        <Ionicons name="location-outline" size={24} color="#2196F3" />
      </View>

      <View style={styles.mainContent}>
        {/* 分类筛选 */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.categoryItemActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 菜品列表 */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>正在加载菜品...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#FF5722" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>重试</Text>
            </TouchableOpacity>
          </View>
        ) : filteredDishes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={48} color="#BDBDBD" />
            <Text style={styles.emptyText}>暂无菜品</Text>
            <Text style={styles.emptySubText}>该分类下暂时没有可用的菜品</Text>
          </View>
        ) : (
          <FlatList
            data={filteredDishes}
            renderItem={renderDishItem}
            keyExtractor={item => item.id.toString()}
            style={styles.dishList}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>

      {/* 购物车底部栏 */}
      {totalQuantity > 0 && (
        <View style={styles.cartBar}>
          <View style={styles.cartInfo}>
            <View style={styles.cartBadgeContainer}>
              <Ionicons name="bag" size={24} color="#FFFFFF" />
              <Badge count={totalQuantity} size="small" style={styles.cartBadge} />
            </View>
            <Text style={styles.cartTotal}>
              共 {totalQuantity} 件商品 ¥{totalPrice.toFixed(2)}
            </Text>
          </View>
          <Button
            title="查看已选"
            onPress={() => setCartVisible(!cartVisible)}
            variant="filled"
            color="#FFFFFF"
            style={styles.viewCartButton}
            textStyle={{ color: '#1976D2' }}
          />
        </View>
      )}

      {/* 购物车详情 */}
      {cartVisible && cartItems.length > 0 && (
        <View style={styles.cartDetails}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>已选商品</Text>
            <TouchableOpacity onPress={() => setCartVisible(false)}>
              <Ionicons name="close" size={24} color="#757575" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id.toString()}
            style={styles.cartList}
          />
          <View style={styles.cartFooter}>
            <View style={styles.cartTotalInfo}>
              <Text style={styles.cartTotalLabel}>总计</Text>
              <Text style={styles.cartTotalPrice}>¥{totalPrice.toFixed(2)}</Text>
            </View>
            <Button
              title="提交订单"
              onPress={handleSubmitOrder}
              variant="filled"
              style={styles.submitButton}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  storeHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  storeLocation: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  mainContent: {
    flex: 1,
  },
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  categoryItemActive: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  categoryText: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dishList: {
    flex: 1,
    padding: 16,
  },
  dishItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 12,
  },
  dishImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
  },
  dishInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 22,
  },
  dishDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 10,
    lineHeight: 18,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dishType: {
    fontSize: 12,
    color: '#9E9E9E',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 2,
  },
  dishPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF5722',
  },
  addButton: {
    backgroundColor: '#FF5722',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  unavailableButton: {
    backgroundColor: '#BDBDBD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  unavailableText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5722',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#BDBDBD',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 8,
  },
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cartInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadgeContainer: {
    position: 'relative',
    marginRight: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  cartTotal: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  viewCartButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 40,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    elevation: 3,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  cartDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  cartList: {
    maxHeight: 200,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  cartItemName: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  cartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemQuantity: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    minWidth: 24,
    textAlign: 'center',
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5722',
    marginLeft: 16,
  },
  cartFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  cartTotalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cartTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cartTotalPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF5722',
  },
  submitButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});