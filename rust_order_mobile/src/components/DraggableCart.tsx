import React, { useEffect } from 'react';
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
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { CartItem, DraggableCartProps } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN_HEIGHT = 200;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.8;
const INITIAL_HEIGHT = SCREEN_HEIGHT * 0.5;

export const DraggableCart: React.FC<DraggableCartProps> = ({
  visible,
  cartItems,
  totalPrice,
  onClose,
  onSubmitOrder,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const height = useSharedValue(INITIAL_HEIGHT);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(SCREEN_HEIGHT - INITIAL_HEIGHT);
      height.value = INITIAL_HEIGHT;
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT);
    }
  }, [visible]);

  // 添加手势状态管理
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // 记录开始位置
      startY.value = translateY.value;
      
      // 添加触觉反馈
      runOnJS(() => {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
          // 忽略触觉反馈错误
        }
      })();
    })
    .onUpdate((event) => {
      const newTranslateY = startY.value + event.translationY;
      const newHeight = SCREEN_HEIGHT - newTranslateY;
      
      // 限制高度范围，添加阻尼效果
      if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
        translateY.value = newTranslateY;
        height.value = newHeight;
      } else if (newHeight < MIN_HEIGHT) {
        // 在最小高度以下添加阻尼效果
        const damping = 0.3;
        const dampedTranslation = startY.value + event.translationY * damping;
        translateY.value = dampedTranslation;
      } else if (newHeight > MAX_HEIGHT) {
        // 在最大高度以上添加阻尼效果
        const damping = 0.3;
        const dampedTranslation = startY.value + event.translationY * damping;
        translateY.value = dampedTranslation;
      }
    })
    .onEnd((event) => {
      const currentHeight = SCREEN_HEIGHT - translateY.value;
      
      // 如果向下拖动速度很快或高度太小，关闭购物车
      if (event.velocityY > 800 || currentHeight < MIN_HEIGHT * 1.2) {
        translateY.value = withSpring(SCREEN_HEIGHT, {
          damping: 20,
          stiffness: 300,
        });
        runOnJS(() => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch (error) {
            // 忽略触觉反馈错误
          }
          onClose();
        })();
        return;
      }
      
      // 否则弹回到合适的高度
      let targetHeight = currentHeight;
      if (currentHeight < INITIAL_HEIGHT * 0.7) {
        targetHeight = MIN_HEIGHT;
      } else if (currentHeight > INITIAL_HEIGHT * 1.3) {
        targetHeight = MAX_HEIGHT;
      } else {
        targetHeight = INITIAL_HEIGHT;
      }
      
      translateY.value = withSpring(SCREEN_HEIGHT - targetHeight, {
        damping: 20,
        stiffness: 300,
      });
      height.value = withSpring(targetHeight, {
        damping: 20,
        stiffness: 300,
      });
      
      // 添加触觉反馈
      runOnJS(() => {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
          // 忽略触觉反馈错误
        }
      })();
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      height: height.value,
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SCREEN_HEIGHT - MAX_HEIGHT, SCREEN_HEIGHT],
      [0.5, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity,
    };
  });

  const handleQuantityChange = (itemId: number, action: 'increase' | 'decrease') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // 忽略触觉反馈错误
    }
    
    if (action === 'increase') {
      onIncreaseQuantity(itemId);
    } else {
      onDecreaseQuantity(itemId);
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
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      {/* 背景遮罩 */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      {/* 可拖动的购物车 */}
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* 拖动指示器 - 可拖拽区域 */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.dragArea}>
            <View style={styles.dragIndicator} />
          </Animated.View>
        </GestureDetector>
        
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
              keyExtractor={item => item.id.toString()}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* 购物车底部 */}
          <View style={[styles.footer, { paddingBottom: 20 + insets.bottom }]}>
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
    </GestureHandlerRootView>
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
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  dragArea: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    // 确保拖拽区域可以接收手势
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: '#C0C0C0',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    minHeight: 120,
  },
  list: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#1DA1F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});