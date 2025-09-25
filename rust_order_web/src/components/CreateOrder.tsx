import { useState, useEffect } from 'react';
import { res } from '../utils/res';
import type { CreateOrderRequest } from '../type/order';
import {Card, CardHeader, CardBody, CardFooter, Button, Input, Chip, Divider, Spinner} from "@heroui/react";

interface Dish {
    id: number;
    dishName: string;
    dishType: string;
    price: number;
    estimatedTime: number;
}

interface OrderItem {
    dish: Dish;
    quantity: number;
}

interface CreateOrderProps {
    onOrderCreated?: () => void;
}

function CreateOrder({ onOrderCreated }: CreateOrderProps) {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
    const [userId, setUserId] = useState('user123');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const dishList = await res('GET', '/api/dishes');
                setDishes(dishList);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDishes();
    }, []);

    const addDish = (dish: Dish) => {
        const existing = selectedItems.find(item => item.dish.id === dish.id);
        if (existing) {
            setSelectedItems(items => 
                items.map(item => 
                    item.dish.id === dish.id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setSelectedItems(items => [...items, { dish, quantity: 1 }]);
        }
    };

    const updateQuantity = (dishId: number, quantity: number) => {
        if (quantity <= 0) {
            setSelectedItems(items => items.filter(item => item.dish.id !== dishId));
        } else {
            setSelectedItems(items => 
                items.map(item => 
                    item.dish.id === dishId ? { ...item, quantity } : item
                )
            );
        }
    };

    const handleSubmit = async () => {
        if (selectedItems.length === 0) return;

        try {
            const orderRequest: CreateOrderRequest = {
                userId,
                items: selectedItems.map(item => ({
                    dishName: item.dish.dishName,
                    dishType: item.dish.dishType,
                    unitPrice: item.dish.price,
                    quantity: item.quantity,
                    estimatedTime: item.dish.estimatedTime
                }))
            };

            const response = await res('POST', '/api/orders/place', orderRequest as { [key: string]: any });
            alert(`订单创建成功！取餐码: ${response.pickupCode}`);
            
            setSelectedItems([]);
            if (onOrderCreated) onOrderCreated();
        } catch (error) {
            console.error(error);
            alert('创建订单失败');
        }
    };

    const total = selectedItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="flex flex-col items-center space-y-4">
                    <Spinner size="lg" color="primary" />
                    <p className="text-gray-600">加载菜品中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-6 flex flex-col">
            {/* 用户信息卡片 */}
            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-gray-900">创建新订单</h2>
                </CardHeader>
                <CardBody>
                    <Input
                        label="用户ID"
                        placeholder="请输入用户ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        variant="bordered"
                        className="max-w-xs"
                        required
                    />
                </CardBody>
            </Card>

            {/* 菜品选择卡片 */}
            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                    <h3 className="text-xl font-semibold text-gray-900">选择菜品</h3>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dishes.map(dish => (
                            <Card 
                                key={dish.id}
                                isPressable 
                                onPress={() => addDish(dish)}
                                className="bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-all duration-200 border border-gray-200"
                            >
                                <CardBody className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900">{dish.dishName}</h4>
                                        <Chip size="sm" variant="flat" color="primary">
                                            {dish.dishType}
                                        </Chip>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-green-600">¥{dish.price}</span>
                                        <span className="text-sm text-gray-500">{dish.estimatedTime}分钟</span>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* 已选择的菜品 */}
            {selectedItems.length > 0 && (
                <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex justify-between items-center w-full">
                            <h3 className="text-xl font-semibold text-gray-900">已选择的菜品</h3>
                            <Chip color="primary" variant="flat">
                                {selectedItems.length} 项
                            </Chip>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {selectedItems.map(item => (
                                <div key={item.dish.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.dish.dishName}</h4>
                                        <p className="text-sm text-gray-600">单价: ¥{item.dish.price}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            onPress={() => updateQuantity(item.dish.id, item.quantity - 1)}
                                        >
                                            -
                                        </Button>
                                        <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            onPress={() => updateQuantity(item.dish.id, item.quantity + 1)}
                                        >
                                            +
                                        </Button>
                                        <div className="ml-4 text-right">
                                            <p className="font-semibold text-gray-900">
                                                ¥{(item.dish.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <Divider className="my-4" />
                        
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">总计</span>
                            <span className="text-2xl font-bold text-green-600">¥{total.toFixed(2)}</span>
                        </div>
                    </CardBody>
                    <CardFooter>
                        <Button
                            color="primary"
                            size="lg"
                            className="w-full font-semibold"
                            isDisabled={selectedItems.length === 0}
                            onPress={handleSubmit}
                        >
                            创建订单
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
export default CreateOrder;