# 🍽️ 锈蚀点餐 (Rust Order System)

一个现代化的餐厅点餐管理一体化系统，支持在线点餐、订单管理、菜品管理等功能。

## 📋 项目概述

锈蚀餐厅点餐系统是一个全栈的餐厅管理解决方案，包含：
- 🌐 **Web端管理后台** - 用于餐厅管理员管理订单、菜品等
- 📱 **移动端应用** - 顾客点餐应用（开发中）
- 🔧 **后端API服务** - 提供完整的RESTful API

## 🏗️ 项目架构

```
rust_order/
├── api/                    # 后端API服务 (Spring Boot)
├── rust_order_web/         # Web管理后台 (React + TypeScript)
├── rust_order_mobile/      # 移动端应用 (开发中)
└── API_Docx.md            # API接口文档
```

## 🛠️ 技术栈

### 后端 (API)
- **框架**: Spring Boot 3.5.5
- **语言**: Java 17
- **数据库**: MySQL 8.0
- **缓存**: Redis
- **实时通信**: WebSocket
- **ORM**: Spring Data JPA
- **构建工具**: Maven

### 前端 (Web)
- **框架**: React 19.1.1
- **语言**: TypeScript 5.8.3
- **构建工具**: Vite 7.1.6
- **UI组件**: HeroUI 2.8.4
- **样式**: Tailwind CSS 4.1.13
- **动画**: Framer Motion 12.23.15
- **包管理**: pnpm 

### 移动端 (开发中)
- 技术栈待定（大概率是ReactNative）

## ✨ 主要功能

### 🎯 已实现功能
- ✅ 菜品管理（增删改查）
- ✅ 订单管理（创建、状态更新、历史查询）
- ✅ 购物车功能
- ✅ 取餐码系统
- ✅ 排队管理
- ✅ 实时订单状态更新
- ✅ 管理员工作台
- ✅ 订单历史记录

### 🚧 开发中功能
- 🔄 移动端顾客应用
- 🔄 支付系统集成
- 🔄 用户认证系统
- 🔄 数据统计分析

## 🚀 快速开始

### 环境要求
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Redis (可选)

### 后端启动

1. **克隆项目**
```bash

# gitee
git clone https://gitee.com/rustlove/rust-order

# github
git clone https://github.com/EnderRomantice/rust-order

cd rust_order/api
```

2. **配置数据库**
```yml
# 在application.properties中配置MySQL数据库连接
spring.application.name=api

# MySQL数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/rust_order?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=ed121212

# JPA配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect


# Redis配置
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.data.redis.password=ed121212
spring.data.redis.timeout=2000ms
spring.data.redis.lettuce.pool.max-active=8
spring.data.redis.lettuce.pool.max-idle=8
spring.data.redis.lettuce.pool.min-idle=0

# 缓存配置 - 如果Redis不可用则降级到简单缓存
spring.cache.type=simple
spring.cache.cache-names=orders

# 服务器配置
server.port=8080

```

3. **启动后端服务**
```bash
./mvnw spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

### 前端启动

1. **进入前端目录**
```bash
cd rust_order/rust_order_web
```

2. **安装依赖**
```bash
npm install
# 或
pnpm install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
pnpm dev
```

前端应用将在 `http://localhost:5173` 启动

## 📖 API 文档

详细的API接口文档请查看 [API_Docx.md](./API_Docx.md)

### 主要接口
- `GET /api/dishes` - 获取菜品列表
- `POST /api/orders` - 创建订单
- `GET /api/admin/orders/queue` - 获取订单队列
- `PUT /api/admin/orders/{id}/status` - 更新订单状态

## 🎨 界面预览

### Web管理后台
- **工作台**: 实时订单队列管理
- **菜品管理**: 菜品的增删改查
- **订单历史**: 历史订单查询和管理

## 📱 移动端 (开发中)

移动端应用正在开发中，将提供：
- 顾客点餐界面
- 购物车功能
- 订单状态查询
- 取餐提醒

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范
- 后端代码遵循 Spring Boot 最佳实践
- 前端代码使用 TypeScript 严格模式
- 提交信息使用约定式提交格式
- 确保代码通过 ESLint 检查

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发起 Discussion

---

⭐ 如果这个项目对你有帮助，请给个 Star！