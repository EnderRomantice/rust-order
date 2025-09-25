-- 改进订单数据结构的迁移脚本
-- 将原有的"每个菜品一条订单记录"改为"一个订单包含多个菜品项"

-- 1. 创建新的订单表
CREATE TABLE t_order_new (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL COMMENT '用户ID',
    pickup_code VARCHAR(6) UNIQUE NOT NULL COMMENT '取餐码',
    order_status VARCHAR(20) NOT NULL COMMENT '订单状态',
    queue_number INT COMMENT '队列号',
    notes TEXT COMMENT '订单级别备注',
    total_price DECIMAL(10,2) NOT NULL COMMENT '订单总价',
    total_estimated_time INT COMMENT '总预计时间（分钟）',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_pickup_code (pickup_code),
    INDEX idx_user_id (user_id),
    INDEX idx_order_status (order_status),
    INDEX idx_queue_number (queue_number),
    INDEX idx_created_at (created_at)
) COMMENT='改进的订单表';

-- 2. 创建订单项表
CREATE TABLE t_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL COMMENT '订单ID',
    dish_name VARCHAR(255) NOT NULL COMMENT '菜品名称',
    dish_type VARCHAR(100) NOT NULL COMMENT '菜品类型',
    unit_price DECIMAL(10,2) NOT NULL COMMENT '单价',
    quantity INT NOT NULL COMMENT '数量',
    subtotal DECIMAL(10,2) NOT NULL COMMENT '小计',
    estimated_time INT COMMENT '预计制作时间（分钟）',
    item_notes TEXT COMMENT '菜品级别备注（如：不要辣）',
    
    FOREIGN KEY (order_id) REFERENCES t_order_new(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_dish_name (dish_name),
    INDEX idx_dish_type (dish_type)
) COMMENT='订单项表';

-- 3. 数据迁移：将原有订单数据迁移到新结构
-- 首先创建订单记录（按取餐码分组）
INSERT INTO t_order_new (
    user_id, 
    pickup_code, 
    order_status, 
    queue_number, 
    notes, 
    total_price, 
    total_estimated_time, 
    created_at, 
    updated_at
)
SELECT 
    user_id,
    pickup_code,
    order_status,
    MIN(queue_number) as queue_number,
    -- 合并备注（去除重复）
    GROUP_CONCAT(DISTINCT CASE WHEN notes IS NOT NULL AND notes != '' THEN notes END SEPARATOR '; ') as notes,
    SUM(price * quantity) as total_price,
    MAX(estimated_time) as total_estimated_time,
    MIN(created_at) as created_at,
    MAX(updated_at) as updated_at
FROM t_order 
WHERE pickup_code IS NOT NULL AND pickup_code != ''
GROUP BY pickup_code, user_id, order_status
ORDER BY MIN(created_at);

-- 4. 迁移订单项数据
INSERT INTO t_order_item (
    order_id, 
    dish_name, 
    dish_type, 
    unit_price, 
    quantity, 
    subtotal, 
    estimated_time, 
    item_notes
)
SELECT 
    on.id as order_id,
    o.name as dish_name,
    o.order_type as dish_type,
    o.price as unit_price,
    o.quantity,
    (o.price * o.quantity) as subtotal,
    o.estimated_time,
    o.notes as item_notes
FROM t_order o
JOIN t_order_new on ON (
    o.pickup_code = on.pickup_code 
    AND o.user_id = on.user_id 
    AND o.order_status = on.order_status
)
WHERE o.pickup_code IS NOT NULL AND o.pickup_code != ''
ORDER BY o.created_at;

-- 5. 验证数据迁移结果
-- 检查订单数量
SELECT 
    '原订单表记录数' as description,
    COUNT(*) as count
FROM t_order
WHERE pickup_code IS NOT NULL AND pickup_code != ''

UNION ALL

SELECT 
    '新订单表记录数' as description,
    COUNT(*) as count
FROM t_order_new

UNION ALL

SELECT 
    '订单项表记录数' as description,
    COUNT(*) as count
FROM t_order_item;

-- 检查总价是否正确
SELECT 
    on.pickup_code,
    on.total_price as new_total_price,
    SUM(oi.subtotal) as calculated_total_price,
    CASE 
        WHEN ABS(on.total_price - SUM(oi.subtotal)) < 0.01 THEN 'OK'
        ELSE 'ERROR'
    END as price_check
FROM t_order_new on
JOIN t_order_item oi ON on.id = oi.order_id
GROUP BY on.id, on.pickup_code, on.total_price
HAVING price_check = 'ERROR';

-- 6. 创建视图以便兼容旧的查询（可选）
CREATE VIEW v_order_legacy AS
SELECT 
    oi.id,
    oi.dish_name as name,
    oi.dish_type as order_type,
    oi.unit_price as price,
    oi.quantity,
    on.user_id,
    on.pickup_code,
    on.order_status,
    on.created_at,
    on.updated_at,
    oi.estimated_time,
    on.queue_number,
    COALESCE(oi.item_notes, on.notes) as notes
FROM t_order_new on
JOIN t_order_item oi ON on.id = oi.order_id;

-- 注意：在确认数据迁移正确后，可以执行以下步骤：
-- 7. 备份原表（生产环境必须）
-- CREATE TABLE t_order_backup AS SELECT * FROM t_order;

-- 8. 重命名表（在确认新系统运行正常后执行）
-- RENAME TABLE t_order TO t_order_old;
-- RENAME TABLE t_order_new TO t_order;

-- 9. 删除旧表（在确认不再需要时执行）
-- DROP TABLE t_order_old;