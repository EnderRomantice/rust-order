import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { dishAPI, type Dish } from '@/src/services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [popularDishes, setPopularDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularDishes = async () => {
      try {
        setLoading(true);
        setError(null);
        const dishes = await dishAPI.getPopularDishes(3);
        setPopularDishes(dishes);
      } catch (err) {
        console.error('Failed to fetch popular dishes:', err);
        setError('获取热门菜品失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDishes();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>锈点餐厅</Text>
              <Text style={styles.heroSubtitle}>品味生活，从这里开始</Text>
              <View style={styles.heroStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>500+</Text>
                  <Text style={styles.statLabel}>精品菜品</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>4.8</Text>
                  <Text style={styles.statLabel}>用户评分</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>15min</Text>
                  <Text style={styles.statLabel}>平均出餐</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={[styles.actionCard, styles.primaryAction]} 
            onPress={() => router.push('/order')}
          >
            <View style={styles.actionIcon}>
               <Ionicons name="restaurant" size={28} color="white" />
             </View>
             <Text style={styles.actionTitle}>立即点餐</Text>
             <Text style={styles.actionSubtitle}>浏览菜单，享受美食</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
             style={[styles.actionCard, styles.secondaryAction]} 
             onPress={() => router.push('/pickup')}
           >
             <View style={styles.actionIcon}>
               <MaterialIcons name="takeout-dining" size={28} color="white" />
             </View>
             <Text style={styles.actionTitle}>取餐查询</Text>
             <Text style={styles.actionSubtitle}>查看订单状态</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Dishes Section */}
        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>今日热门</Text>
             <View style={styles.topBadge}>
               <Text style={styles.topBadgeText}>TOP 3</Text>
             </View>
           </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingSpinner} />
              <Text style={styles.loadingText}>正在加载热门菜品...</Text>
            </View>
          ) : error ? (
             <View style={styles.errorContainer}>
               <View style={styles.statusIcon}>
                 <Ionicons name="warning" size={24} color="#e74c3c" />
               </View>
               <Text style={styles.errorText}>{error}</Text>
               <TouchableOpacity style={styles.retryButton}>
                 <Text style={styles.retryButtonText}>重试</Text>
               </TouchableOpacity>
             </View>
           ) : popularDishes.length === 0 ? (
             <View style={styles.emptyContainer}>
               <View style={styles.statusIcon}>
                 <Feather name="coffee" size={24} color="#bdc3c7" />
               </View>
               <Text style={styles.emptyText}>暂无热门菜品</Text>
               <Text style={styles.emptySubtext}>敬请期待更多美味</Text>
             </View>
          ) : (
            <View style={styles.dishesGrid}>
              {popularDishes.map((dish, index) => (
                <TouchableOpacity key={dish.id} style={styles.dishCard}>
                  <View style={styles.dishImageContainer}>
                    <ImageBackground
                      source={{ uri: dish.imageUrl || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80` }}
                      style={styles.dishImage}
                      imageStyle={styles.dishImageStyle}
                    >
                      <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>{index + 1}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                  
                  <View style={styles.dishInfo}>
                    <Text style={styles.dishName} numberOfLines={1}>{dish.dishName}</Text>
                    <Text style={styles.dishType}>{dish.dishType}</Text>
                    
                    <View style={styles.dishFooter}>
                      <Text style={styles.dishPrice}>¥{dish.price.toFixed(2)}</Text>
                      <View style={styles.timeContainer}>
                        <Ionicons name="time" size={12} color="#7f8c8d" style={{ marginRight: 4 }} />
                        <Text style={styles.timeText}>{dish.estimatedTime}min</Text>
                      </View>
                    </View>
                    
                    {dish.description && (
                      <Text style={styles.dishDescription} numberOfLines={2}>
                        {dish.description}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Store Info */}
        <View style={styles.storeSection}>
           <Text style={styles.sectionTitle}>店铺信息</Text>
           <View style={styles.storeCard}>
             <View style={styles.storeItem}>
               <View style={styles.storeIconContainer}>
                 <Ionicons name="time" size={20} color="#1DA1F2" />
               </View>
               <View style={styles.storeTextContainer}>
                 <Text style={styles.storeLabel}>营业时间</Text>
                 <Text style={styles.storeValue}>09:00 - 21:00</Text>
               </View>
             </View>
             
             <View style={styles.storeItem}>
               <View style={styles.storeIconContainer}>
                 <Ionicons name="call" size={20} color="#1DA1F2" />
               </View>
               <View style={styles.storeTextContainer}>
                 <Text style={styles.storeLabel}>联系电话</Text>
                 <Text style={styles.storeValue}>400-123-4567</Text>
               </View>
             </View>
             
             <View style={styles.storeItem}>
               <View style={styles.storeIconContainer}>
                 <Ionicons name="location" size={20} color="#1DA1F2" />
               </View>
               <View style={styles.storeTextContainer}>
                 <Text style={styles.storeLabel}>店铺地址</Text>
                 <Text style={styles.storeValue}>北京市朝阳区科技园区</Text>
               </View>
             </View>
           </View>
         </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  
  // Hero Section
  heroSection: {
    height: 280,
    marginBottom: 20,
  },
  heroBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  heroBackgroundImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
    marginBottom: 30,
    textAlign: 'center',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 15,
  },

  // Actions Section
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 30,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryAction: {
    backgroundColor: '#ff6b35',
  },
  secondaryAction: {
    backgroundColor: '#1DA1F2',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
     fontSize: 16,
     fontWeight: 'bold',
     color: 'white',
     marginBottom: 4,
   },
  actionSubtitle: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },

  // Popular Section
  popularSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  topBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  topBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  dishesGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 10,
  },
  dishCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    maxWidth: (width - 46) / 3, // 调整最大宽度确保3个卡片能完全显示
  },
  dishImageContainer: {
    height: 100,
    position: 'relative',
  },
  dishImage: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  dishImageStyle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  rankText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  dishInfo: {
    padding: 8,
  },
  dishName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 3,
    lineHeight: 16,
  },
  dishType: {
    fontSize: 10,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 10,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  dishDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },

  // Loading, Error, Empty States
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ecf0f1',
    borderTopColor: '#ff6b35',
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
  },

  // Store Section
  storeSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  storeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  storeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  storeTextContainer: {
    flex: 1,
  },
  storeLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  storeValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
});
