import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { res } from '../utils/res';
import type { DishModel, DishCardProps } from '../types';
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Switch, 
  Spinner, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  useDisclosure
} from "@heroui/react";

// 菜品卡片组件
const DishCard = memo(({ 
  dish, 
  onToggleAvailability, 
  isPending 
}: DishCardProps) => {
  return (
    <Card className="bg-white/80 shadow-none border border-gray-200/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start w-full">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{dish.dishName}</h3>
            <p className="text-sm text-gray-600">{dish.dishType}</p>
          </div>
          <Switch
            isSelected={dish.isAvailable}
            onValueChange={() => onToggleAvailability(dish.id, dish.isAvailable)}
            color="success"
            size="sm"
            isDisabled={isPending}
          />
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <p className="text-gray-700 text-sm mb-3">{dish.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">¥{dish.price}</span>
          <span className="text-sm text-gray-500">{dish.estimatedTime}分钟</span>
        </div>
        <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            dish.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {dish.isAvailable ? '已上架' : '已下架'}
          </span>
        </div>
      </CardBody>
    </Card>
  );
});

const MenuManagePage = () => {
  const [dishes, setDishes] = useState<DishModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [pendingToggle, setPendingToggle] = useState<Set<number>>(new Set());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newDish, setNewDish] = useState({
    dishName: '',
    dishType: '主食',
    price: 0,
    description: '',
    estimatedTime: 15
  });

  const dishTypes = ['主食', '汤品', '饮品', '小菜', '甜品'];

  const getDishes = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      console.log('正在获取菜品列表...');
      const data = await res('GET', '/api/dishes/admin');
      console.log('获取菜品列表成功:', data);
      setDishes(data);
    } catch (err) {
      console.error('获取菜品失败:', err);
      alert(`获取菜品失败: ${(err as Error).message || err}`);
    } finally {
      if (isManualRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getDishes();
  }, []);

  const toggleAvailability = useCallback(async (dishId: number, isAvailable: boolean) => {
    // 防止重复点击
    if (pendingToggle.has(dishId)) {
      return;
    }

    try {
      console.log('切换菜品状态:', { dishId, currentStatus: isAvailable, newStatus: !isAvailable });
      
      // 添加到pending状态
      setPendingToggle(prev => new Set(prev).add(dishId));
      
      // 乐观更新：立即更新UI状态
      setDishes(prevDishes => 
        prevDishes.map(dish => 
          dish.id === dishId 
            ? { ...dish, isAvailable: !isAvailable }
            : dish
        )
      );
      
      const response = await res('PATCH', `/api/dishes/admin/${dishId}/availability`, {
        isAvailable: !isAvailable
      });
      
      console.log('切换菜品状态成功:', response);
      // 不再需要刷新整个列表
    } catch (err) {
      console.error('切换菜品状态失败:', err);
      // 如果请求失败，回滚状态
      setDishes(prevDishes => 
        prevDishes.map(dish => 
          dish.id === dishId 
            ? { ...dish, isAvailable: isAvailable }
            : dish
        )
      );
      alert(`切换菜品状态失败: ${(err as Error).message || err}`);
    } finally {
      // 移除pending状态
      setPendingToggle(prev => {
        const newSet = new Set(prev);
        newSet.delete(dishId);
        return newSet;
      });
    }
  }, [pendingToggle]);

  const createDish = async () => {
    try {
      const response = await res('POST', '/api/dishes/admin', newDish);
      
      // 乐观更新：立即添加新菜品到列表
      setDishes(prevDishes => [...prevDishes, response]);
      
      setNewDish({
        dishName: '',
        dishType: '主食',
        price: 0,
        description: '',
        estimatedTime: 15
      });
      onClose();
      // 不再需要刷新整个列表
    } catch (err) {
      console.error('创建菜品失败:', err);
      alert(`创建菜品失败: ${(err as Error).message || err}`);
    }
  };

  const filteredDishes = useMemo(() => {
    return selectedType === 'all' 
      ? dishes 
      : dishes.filter(dish => dish.dishType === selectedType);
  }, [dishes, selectedType]);

  const { availableDishes, unavailableDishes } = useMemo(() => {
    const available = dishes.filter(dish => dish.isAvailable).length;
    const unavailable = dishes.filter(dish => !dish.isAvailable).length;
    return { availableDishes: available, unavailableDishes: unavailable };
  }, [dishes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" color="primary" />
          <p className="text-gray-600 text-lg">加载菜品数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">菜单管理</h1>
          <p className="text-gray-600 mt-1">管理菜品的上架和下架状态</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            color="primary"
            onPress={onOpen}
          >
            + 添加菜品
          </Button>
          <Button
            variant="flat"
            color="primary"
            onPress={() => getDishes(true)}
            isLoading={refreshing}
            isDisabled={refreshing}
          >
            刷新
          </Button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总菜品数</p>
              <p className="text-2xl font-bold text-gray-900">{dishes.length}</p>
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
              <p className="text-sm font-medium text-gray-600">已上架</p>
              <p className="text-2xl font-bold text-gray-900">{availableDishes}</p>
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
              <p className="text-sm font-medium text-gray-600">已下架</p>
              <p className="text-2xl font-bold text-gray-900">{unavailableDishes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">筛选类型:</span>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={selectedType === 'all' ? 'solid' : 'flat'}
              color="primary"
              onPress={() => setSelectedType('all')}
            >
              全部
            </Button>
            {dishTypes.map(type => (
              <Button
                key={type}
                size="sm"
                variant={selectedType === type ? 'solid' : 'flat'}
                color="primary"
                onPress={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 菜品列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onToggleAvailability={toggleAvailability}
            isPending={pendingToggle.has(dish.id)}
          />
        ))}
      </div>

      {/* 添加菜品模态框 */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>添加新菜品</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="菜品名称"
                placeholder="请输入菜品名称"
                value={newDish.dishName}
                onValueChange={(value) => setNewDish({...newDish, dishName: value})}
              />
              <Select
                label="菜品类型"
                selectedKeys={[newDish.dishType]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setNewDish({...newDish, dishType: selectedKey});
                }}
              >
                {dishTypes.map((type) => (
                  <SelectItem key={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="价格"
                type="number"
                placeholder="0.00"
                value={newDish.price.toString()}
                onValueChange={(value) => setNewDish({...newDish, price: parseFloat(value) || 0})}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">¥</span>
                  </div>
                }
              />
              <Input
                label="预计制作时间"
                type="number"
                placeholder="15"
                value={newDish.estimatedTime.toString()}
                onValueChange={(value) => setNewDish({...newDish, estimatedTime: parseInt(value) || 15})}
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">分钟</span>
                  </div>
                }
              />
              <Textarea
                label="菜品描述"
                placeholder="请输入菜品描述"
                value={newDish.description}
                onValueChange={(value) => setNewDish({...newDish, description: value})}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              取消
            </Button>
            <Button 
              color="primary" 
              onPress={createDish}
              isDisabled={!newDish.dishName || !newDish.price}
            >
              添加菜品
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MenuManagePage;