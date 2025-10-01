import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Haptics,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { CartItem, DraggableCartProps } from '../types';
import { useCartStore } from '../store/cartStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CART_HEIGHT = SCREEN_HEIGHT * 0.65; // 减少到65%，让弹出框位置更靠上
const BOTTOM_MARGIN = 60; // 增加底部边距

export const DraggableCart: React.FC<DraggableCartProps> = ({
  visible,
  onClose,
  onSubmitOrder,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // 使用内部的useCartStore获取实时数据
  const {
    items: cartItems,
    totalPrice,
    increaseItemQuantity,
    decreaseItemQuantity,
  } = useCartStore();

  // 强制更新机制，确保组件在购物车状态变化时重新渲染
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [cartItems, totalPrice]);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(SCREEN_HEIGHT - CART_HEIGHT - BOTTOM_MARGIN, {
        damping: 35,    // 进一步增加阻尼，减少弹跳
        stiffness: 150, // 进一步降低刚度，使动画更加平缓
      });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 35,
        stiffness: 150,
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      height: CART_HEIGHT,
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SCREEN_HEIGHT - CART_HEIGHT - BOTTOM_MARGIN, SCREEN_HEIGHT],
      [0.5, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity,
    };
  });

  const handleQuantityChange = async (itemId: number, action: 'increase' | 'decrease') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // 忽略触觉反馈错误
    }
    
    if (action === 'increase') {
      await increaseItemQuantity(itemId);
    } else {
      await decreaseItemQuantity(itemId);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      {/* 商品缩略图 */}
      <View style={styles.cartItemImageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.cartItemImage} />
        ) : (
          <View style={styles.cartItemImagePlaceholder}>
            <Ionicons name="restaurant" size={20} color="#C0C0C0" />
          </View>
        )}
      </View>
      
      {/* 商品信息 */}
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.dishName}</Text>
        <Text style={styles.cartItemType}>{item.dishType}</Text>
      </View>
      
      {/* 价格和控制器 */}
      <View style={styles.cartItemRightSection}>
        <Text style={styles.cartItemPrice}>¥{(item.price * item.quantity).toFixed(2)}</Text>
        <View style={styles.cartItemControls}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => handleQuantityChange(item.id, 'decrease')}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => handleQuantityChange(item.id, 'increase')}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* 背景遮罩 */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      {/* 购物车 */}
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* 购物车头部 */}
        <View style={styles.header}>
          <Text style={styles.title}>已选商品</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#757575" />
          </TouchableOpacity>
        </View>

        {/* 购物车内容 */}
        <View style={styles.content}>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => `${item.id}-${item.quantity}`}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            extraData={`${cartItems.map(item => item.quantity).join(',')}-${forceUpdate}`}
          />
        </View>

        {/* 购物车底部 */}
        <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 10) }]}>
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>总计</Text>
            <Text style={styles.totalPrice}>¥{totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              } catch (error) {
                // 忽略触觉反馈错误
              }
              onSubmitOrder();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>提交订单</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 15,  // 减少阴影强度
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },  // 减少阴影偏移
    shadowOpacity: 0.15,  // 减少阴影透明度
    shadowRadius: 12,     // 减少阴影半径
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,  // 减少padding
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,  // 稍微减小字体
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    minHeight: 100,  // 减少最小高度
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 10,  // 为列表底部添加间距
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,  // 稍微减少padding
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  cartItemImageContainer: {
    marginRight: 12,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  cartItemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  cartItemName: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    marginBottom: 4,
  },
  cartItemType: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '400',
  },
  cartItemRightSection: {
    alignItems: 'flex-end',
  },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1DA1F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,  // 减少按钮阴影
    shadowRadius: 3,
    elevation: 2,  // 减少elevation
  },
  cartItemQuantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1DA1F2',
    marginBottom: 4,
  },
  footer: {
    padding: 16,  // 减少padding
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,  // 稍微减少间距
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1DA1F2',
  },
  submitButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 14,  // 稍微减少padding
    borderRadius: 12,     // 减少圆角
    shadowColor: '#1DA1F2',
    shadowOffset: { width: 0, height: 3 },  // 减少阴影
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,  // 减少elevation
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});