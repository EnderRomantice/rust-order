# 锈蚀餐厅点餐系统 API 接口文档

## 概述

**基础URL**: `http://localhost:8080`

**数据格式**: JSON

**字符编码**: UTF-8

---

## 数据模型

### Dish (菜品)
```json
{
  "id": 1,
  "dishName": "宫保鸡丁饭",
  "dishType": "主食",
  "price": 28.0,
  "description": "经典川菜，鸡丁配花生米，香辣可口",
  "imageUrl": "http://example.com/image.jpg",
  "isAvailable": true,
  "estimatedTime": 15,
  "sortOrder": 1,
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

### Order (订单) - 改进后的数据结构
```json
{
  "id": 1,
  "userId": "user123",
  "pickupCode": "123456",
  "orderStatus": "PENDING",
  "queueNumber": 1,
  "notes": "不要太咸",
  "totalPrice": 56.0,
  "totalEstimatedTime": 20,
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z",
  "items": [
    {
      "id": 1,
      "dishName": "宫保鸡丁饭",
      "dishType": "主食",
      "unitPrice": 28.0,
      "quantity": 2,
      "subtotal": 56.0,
      "estimatedTime": 15,
      "itemNotes": "不要辣"
    }
  ]
}
```

### OrderItem (订单项)
```json
{
  "id": 1,
  "dishName": "宫保鸡丁饭",
  "dishType": "主食",
  "unitPrice": 28.0,
  "quantity": 2,
  "subtotal": 56.0,
  "estimatedTime": 15,
  "itemNotes": "不要辣"
}
```

### CartItem (购物车项)
```json
{
  "name": "宫保鸡丁饭",
  "orderType": "主食",
  "price": 28.0,
  "quantity": 2
}
```

### Cart (购物车)
```json
{
  "userId": "user123",
  "items": [
    {
      "name": "宫保鸡丁饭",
      "orderType": "主食",
      "price": 28.0,
      "quantity": 2
    }
  ],
  "totalPrice": 56.0,
  "totalQuantity": 2,
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

### OrderStatus (订单状态枚举)
- `PENDING`: 待处理
- `CONFIRMED`: 已确认
- `PREPARING`: 制作中
- `READY`: 待取餐
- `COMPLETED`: 已完成
- `CANCELLED`: 已取消

### 数据结构改进说明

**重要变更**: 从v2.0开始，订单数据结构进行了重大改进：

#### 改进前的问题
- 每个菜品作为独立的Order记录存储
- 相同取餐码的多个菜品都有各自的orderStatus和notes
- 数据冗余严重，逻辑不清晰

#### 改进后的优势
- **一个取餐码对应一个订单**：订单状态、备注、取餐码等信息在订单级别统一管理
- **订单包含多个订单项**：菜品信息存储在OrderItem中，支持菜品级别的特殊要求
- **数据一致性**：避免了同一订单不同状态的问题
- **性能提升**：减少数据库记录数量，简化查询逻辑

#### 新的请求/响应格式

**创建订单请求**:
```json
{
  "userId": "user123",
  "notes": "不要太咸",
  "items": [
    {
      "dishName": "宫保鸡丁饭",
      "dishType": "主食",
      "unitPrice": 28.0,
      "quantity": 2,
      "estimatedTime": 15,
      "itemNotes": "不要辣"
    },
    {
      "dishName": "白米饭",
      "dishType": "主食",
      "unitPrice": 3.0,
      "quantity": 1,
      "estimatedTime": 5,
      "itemNotes": ""
    }
  ]
}
```

**订单响应格式**:
```json
{
  "id": 1,
  "userId": "user123",
  "pickupCode": "123456",
  "orderStatus": "PENDING",
  "queueNumber": 1,
  "notes": "不要太咸",
  "totalPrice": 59.0,
  "totalEstimatedTime": 15,
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z",
  "items": [
    {
      "id": 1,
      "dishName": "宫保鸡丁饭",
      "dishType": "主食",
      "unitPrice": 28.0,
      "quantity": 2,
      "subtotal": 56.0,
      "estimatedTime": 15,
      "itemNotes": "不要辣"
    },
    {
      "id": 2,
      "dishName": "白米饭",
      "dishType": "主食",
      "unitPrice": 3.0,
      "quantity": 1,
      "subtotal": 3.0,
      "estimatedTime": 5,
      "itemNotes": ""
    }
  ]
}
```

---

## 菜品管理 API

### 1. 获取所有可用菜品
**GET** `/api/dishes`

**描述**: 获取所有可用菜品列表，按类型和排序顺序排列

**响应**:
```json
[
  {
    "id": 1,
    "dishName": "宫保鸡丁饭",
    "dishType": "主食",
    "price": 28.0,
    "description": "经典川菜",
    "isAvailable": true,
    "estimatedTime": 15
  }
]
```

### 2. 根据类型获取菜品
**GET** `/api/dishes/type/{dishType}`

**参数**:
- `dishType` (路径参数): 菜品类型，如"主食"、"汤品"、"饮品"

**响应**: 菜品列表

### 3. 根据ID获取菜品详情
**GET** `/api/dishes/{id}`

**参数**:
- `id` (路径参数): 菜品ID

**响应**: 菜品详情或404

### 4. 创建菜品 (管理员)
**POST** `/api/dishes/admin`

**请求体**:
```json
{
  "dishName": "新菜品",
  "dishType": "主食",
  "price": 25.0,
  "description": "菜品描述",
  "estimatedTime": 12
}
```

**响应**: 创建的菜品信息

### 5. 设置菜品可用状态 (管理员)
**PATCH** `/api/dishes/admin/{id}/availability`

**请求体**:
```json
{
  "isAvailable": false
}
```

### 6. 批量创建菜品 (管理员)
**POST** `/api/dishes/admin/batch`

**请求体**: 菜品数组

---

## 菜单管理 API

### 1. 获取可用菜单
**GET** `/api/menu`

**描述**: 获取所有可用菜单项

### 2. 根据类型获取菜单
**GET** `/api/menu/type/{dishType}`

### 3. 根据名称获取菜品
**GET** `/api/menu/dish/{dishName}`

### 4. 检查菜品可用性
**GET** `/api/menu/check/{dishName}`

**响应**:
```json
{
  "available": true
}
```

---

## 购物车 API

### 1. 获取用户购物车
**GET** `/api/cart/{userId}`

**参数**:
- `userId` (路径参数): 用户ID

**响应**: 购物车信息

### 2. 添加商品到购物车
**POST** `/api/cart/{userId}/items`

**请求体**:
```json
{
  "name": "宫保鸡丁饭",
  "orderType": "主食",
  "price": 28.0,
  "quantity": 1
}
```

**响应**: 更新后的购物车

### 3. 清空购物车
**DELETE** `/api/cart/{userId}`

### 4. 购物车结算
**POST** `/api/cart/{userId}/checkout`

**描述**: 将购物车内容转换为订单

**响应**: 取餐码字符串
```json
"123456"
```

---

## 订单管理 API

### 1. 获取所有订单
**GET** `/api/orders`

### 2. 根据ID获取订单
**GET** `/api/orders/{id}`

### 3. 创建订单 (v2.0 新格式)
**POST** `/api/orders`

**描述**: 创建新订单，支持多个菜品项

**请求体**:
```json
{
  "userId": "user123",
  "notes": "不要太咸",
  "items": [
    {
      "dishName": "宫保鸡丁饭",
      "dishType": "主食",
      "unitPrice": 28.0,
      "quantity": 2,
      "estimatedTime": 15,
      "itemNotes": "不要辣"
    },
    {
      "dishName": "白米饭",
      "dishType": "主食",
      "unitPrice": 3.0,
      "quantity": 1,
      "estimatedTime": 5,
      "itemNotes": ""
    }
  ]
}
```

**响应**: 取餐码
```json
{
  "pickupCode": "123456",
  "message": "订单创建成功"
}
```

### 4. 直接下单 (v2.0 新格式)
**POST** `/api/orders/place`

**描述**: 绕过购物车直接下单，支持多个菜品

**请求体**: 同创建订单格式

**响应**: 完整订单信息

### 5. 根据取餐码查询订单
**GET** `/api/orders/pickup/{pickupCode}`

**描述**: 用户查询订单状态

### 6. 获取用户订单历史
**GET** `/api/orders/user/{userId}`

### 7. 根据类型获取订单
**GET** `/api/orders/type/{orderType}`

### 8. 更新订单
**PUT** `/api/orders/{id}`

### 9. 删除订单
**DELETE** `/api/orders/{id}`

---

## 管理端订单 API

### 1. 获取订单队列 (v2.0 新格式)
**GET** `/api/admin/orders/queue`

**描述**: 获取当前订单队列，每个订单包含多个菜品项

**响应**:
```json
[
  {
    "id": 1,
    "userId": "user123",
    "pickupCode": "123456",
    "orderStatus": "PENDING",
    "queueNumber": 1,
    "notes": "不要太咸",
    "totalPrice": 59.0,
    "totalEstimatedTime": 15,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z",
    "items": [
      {
        "id": 1,
        "dishName": "宫保鸡丁饭",
        "dishType": "主食",
        "unitPrice": 28.0,
        "quantity": 2,
        "subtotal": 56.0,
        "estimatedTime": 15,
        "itemNotes": "不要辣"
      },
      {
        "id": 2,
        "dishName": "白米饭",
        "dishType": "主食",
        "unitPrice": 3.0,
        "quantity": 1,
        "subtotal": 3.0,
        "estimatedTime": 5,
        "itemNotes": ""
      }
    ]
  }
]
```

### 2. 获取订单队列 (列表格式)
**GET** `/api/admin/orders/queue/list`

### 3. 根据状态获取订单
**GET** `/api/admin/orders/status/{status}`

**参数**:
- `status`: PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED

### 4. 获取下一个待处理订单
**GET** `/api/admin/orders/next`

### 5. 确认订单
**POST** `/api/admin/orders/{orderId}/confirm`

**请求体** (可选):
```json
{
  "notes": "备注信息"
}
```

### 6. 开始制作
**POST** `/api/admin/orders/{orderId}/prepare`

### 7. 制作完成
**POST** `/api/admin/orders/{orderId}/ready`

### 8. 完成订单
**POST** `/api/admin/orders/{orderId}/complete`

### 9. 取消订单
**POST** `/api/admin/orders/{orderId}/cancel`

---

## 错误响应格式

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "message": "错误描述",
  "details": "详细错误信息"
}
```

## HTTP状态码

- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `204 No Content`: 请求成功，无返回内容
- `400 Bad Request`: 请求参数错误
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误

---

## 数据迁移指南 (v1.0 → v2.0)

### 迁移概述

从v1.0升级到v2.0需要进行数据结构迁移，将原有的"每个菜品一条订单记录"改为"一个订单包含多个菜品项"的结构。

### 迁移步骤

#### 1. 数据库备份
```sql
-- 备份原订单表
CREATE TABLE t_order_backup AS SELECT * FROM t_order;
```

#### 2. 创建新表结构
```sql
-- 执行迁移脚本 V2__improve_order_structure.sql
-- 该脚本会创建 t_order_new 和 t_order_item 表
```

#### 3. 数据迁移验证
```sql
-- 验证迁移结果
SELECT 
    '原订单记录数' as type, COUNT(*) as count 
FROM t_order 
WHERE pickup_code IS NOT NULL

UNION ALL

SELECT 
    '新订单记录数' as type, COUNT(*) as count 
FROM t_order_new;
```

#### 4. 应用程序更新
- 更新后端实体类和服务层
- 更新前端组件以适应新的数据结构
- 更新API调用方式

#### 5. 切换到新系统
```sql
-- 在确认数据正确后执行
RENAME TABLE t_order TO t_order_old;
RENAME TABLE t_order_new TO t_order;
```

### 兼容性说明

#### API版本控制
- v1.0 API: 继续支持旧格式（通过兼容层）
- v2.0 API: 使用新的数据结构

#### 前端适配
- 订单卡片组件需要适配新的数据结构
- 状态更新逻辑简化（只需更新一条记录）
- 队列显示逻辑优化

### 注意事项

1. **数据一致性**: 迁移过程中确保数据完整性
2. **业务连续性**: 建议在低峰期进行迁移
3. **回滚计划**: 准备回滚方案以防迁移失败
4. **测试验证**: 在测试环境充分验证后再在生产环境执行
5. **监控告警**: 迁移后密切监控系统运行状态

### 迁移后的优势

- ✅ 数据一致性提升
- ✅ 查询性能优化
- ✅ 业务逻辑简化
- ✅ 存储空间节省
- ✅ 维护成本降低

---

## 使用示例

### 完整点餐流程 (v2.0)

#### 方式一：通过购物车下单

1. **获取菜品列表**
   ```
   GET /api/dishes
   ```

2. **添加到购物车**
   ```
   POST /api/cart/user123/items
   {
     "name": "宫保鸡丁饭",
     "orderType": "主食",
     "price": 28.0,
     "quantity": 2
   }
   ```

3. **结算下单**
   ```
   POST /api/cart/user123/checkout
   ```
   响应: "123456"

#### 方式二：直接下单 (v2.0 推荐)

1. **获取菜品列表**
   ```
   GET /api/dishes
   ```

2. **直接创建订单**
   ```
   POST /api/orders/place
   {
     "userId": "user123",
     "notes": "不要太咸",
     "items": [
       {
         "dishName": "宫保鸡丁饭",
         "dishType": "主食",
         "unitPrice": 28.0,
         "quantity": 2,
         "itemNotes": "不要辣"
       },
       {
         "dishName": "白米饭",
         "dishType": "主食",
         "unitPrice": 3.0,
         "quantity": 1,
         "itemNotes": ""
       }
     ]
   }
   ```
   
   响应:
   ```json
   {
     "id": 1,
     "userId": "user123",
     "pickupCode": "123456",
     "orderStatus": "PENDING",
     "queueNumber": 1,
     "notes": "不要太咸",
     "totalPrice": 59.0,
     "totalEstimatedTime": 15,
     "createdAt": "2024-01-01T12:00:00Z",
     "items": [...]
   }
   ```

3. **查询订单状态**
   ```
   GET /api/orders/pickup/123456
   ```

### 管理端处理流程 (v2.0)

1. **查看订单队列**
   ```
   GET /api/admin/orders/queue
   ```
   
   响应: 返回完整订单列表，每个订单包含多个菜品项

2. **确认订单**
   ```
   POST /api/admin/orders/1/confirm
   ```
   
   效果: 整个订单状态变为 CONFIRMED

3. **开始制作**
   ```
   POST /api/admin/orders/1/prepare
   ```
   
   效果: 整个订单状态变为 PREPARING

4. **制作完成**
   ```
   POST /api/admin/orders/1/ready
   ```
   
   效果: 整个订单状态变为 READY

5. **完成订单**
   ```
   POST /api/admin/orders/1/complete
   ```
   
   效果: 整个订单状态变为 COMPLETED

### v1.0 vs v2.0 对比示例

#### v1.0 (旧版本) - 每个菜品一条记录
```json
// 两个菜品需要两条订单记录
[
  {
    "id": 1,
    "name": "宫保鸡丁饭",
    "quantity": 2,
    "pickupCode": "123456",
    "orderStatus": "PENDING"
  },
  {
    "id": 2,
    "name": "白米饭",
    "quantity": 1,
    "pickupCode": "123456",
    "orderStatus": "PENDING"
  }
]
```

#### v2.0 (新版本) - 一个订单包含多个菜品项
```json
// 一个订单包含所有菜品
{
  "id": 1,
  "pickupCode": "123456",
  "orderStatus": "PENDING",
  "totalPrice": 59.0,
  "items": [
    {
      "dishName": "宫保鸡丁饭",
      "quantity": 2,
      "subtotal": 56.0
    },
    {
      "dishName": "白米饭",
      "quantity": 1,
      "subtotal": 3.0
    }
  ]
}
```

---

## 注意事项

1. 所有时间字段使用ISO 8601格式
2. 价格字段使用Double类型，保留两位小数
3. 用户ID建议使用唯一标识符
4. 取餐码为6位数字字符串
5. 管理员接口需要适当的权限控制
6. 建议在生产环境中添加API认证和授权机制