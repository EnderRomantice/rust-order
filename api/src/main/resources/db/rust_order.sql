/*
 Navicat Premium Dump SQL

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80026 (8.0.26)
 Source Host           : localhost:3306
 Source Schema         : rust_order

 Target Server Type    : MySQL
 Target Server Version : 80026 (8.0.26)
 File Encoding         : 65001

 Date: 26/09/2025 16:48:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_dish
-- ----------------------------
DROP TABLE IF EXISTS `t_dish`;
CREATE TABLE `t_dish`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `dish_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dish_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `estimated_time` int NULL DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_available` bit(1) NOT NULL,
  `price` double NOT NULL,
  `sort_order` int NULL DEFAULT NULL,
  `updated_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UKhccvbmuw8ey9qw7hqyagpgba7`(`dish_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 147 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_dish
-- ----------------------------
INSERT INTO `t_dish` VALUES (1, '2025-09-18 17:31:17.000000', '经典川菜，鸡丁配花生米，香辣可口', '宫保鸡丁饭', '主食', 15, 'http://example.com/gongbao.jpg', b'1', 28, 1, '2025-09-20 21:06:42.404000');
INSERT INTO `t_dish` VALUES (2, '2025-09-18 17:31:17.000000', '香喷喷的白米饭', '白米饭', '主食', 5, 'http://example.com/rice.jpg', b'1', 3, 2, '2025-09-19 18:02:12.944000');
INSERT INTO `t_dish` VALUES (3, '2025-09-18 17:31:17.000000', '冰镇可乐', '可乐', '饮品', 1, 'http://example.com/cola.jpg', b'1', 5, 3, '2025-09-19 17:56:27.200000');
INSERT INTO `t_dish` VALUES (76, '2025-09-19 15:24:04.791000', '添加八角，茴香等传统香料。细致入微。', '烤全人', '主食', 150, NULL, b'1', 688, 0, '2025-09-19 17:56:25.692000');
INSERT INTO `t_dish` VALUES (77, '2025-09-19 15:40:41.344000', '采用小米椒，泡椒', '凉拌木耳', '小菜', 10, NULL, b'1', 10, 0, '2025-09-19 17:56:22.073000');
INSERT INTO `t_dish` VALUES (143, '2025-09-23 14:10:14.531000', '意面最原本的辛辣风味，贵州干辣椒 & 马苏里拉奶酪的极致搭配。', '刺客意面', '主食', 15, NULL, b'1', 39, 0, '2025-09-23 14:10:14.531000');
INSERT INTO `t_dish` VALUES (144, '2025-09-23 14:12:06.232000', '在可乐的基础上做了代糖 + 柠檬片的改变', '无糖可乐', '饮品', 10, NULL, b'1', 5, 0, '2025-09-23 14:12:06.232000');
INSERT INTO `t_dish` VALUES (145, '2025-09-23 14:13:24.966000', '经典中式甜品', '杨枝甘露', '甜品', 15, NULL, b'1', 10, 0, '2025-09-23 14:13:24.966000');
INSERT INTO `t_dish` VALUES (146, '2025-09-23 14:14:26.271000', '晶莹剔透', '水煮白菜汤', '汤品', 25, NULL, b'1', 25, 0, '2025-09-23 14:14:26.271000');

-- ----------------------------
-- Table structure for t_order_item
-- ----------------------------
DROP TABLE IF EXISTS `t_order_item`;
CREATE TABLE `t_order_item`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `dish_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dish_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `estimated_time` int NULL DEFAULT NULL,
  `item_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `quantity` int NOT NULL,
  `subtotal` double NOT NULL,
  `unit_price` double NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKswjpuehgskphcckjlaxm1tqfm`(`order_id` ASC) USING BTREE,
  CONSTRAINT `FKswjpuehgskphcckjlaxm1tqfm` FOREIGN KEY (`order_id`) REFERENCES `t_order_new` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 109 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_order_item
-- ----------------------------
INSERT INTO `t_order_item` VALUES (11, '可乐', '饮品', 1, NULL, 1, 5, 5, 8);
INSERT INTO `t_order_item` VALUES (12, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 8);
INSERT INTO `t_order_item` VALUES (13, '白米饭', '主食', 5, NULL, 1, 3, 3, 8);
INSERT INTO `t_order_item` VALUES (14, '宫保鸡丁饭', '主食', 15, NULL, 20, 560, 28, 9);
INSERT INTO `t_order_item` VALUES (15, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 10);
INSERT INTO `t_order_item` VALUES (16, '可乐', '饮品', 1, NULL, 1, 5, 5, 10);
INSERT INTO `t_order_item` VALUES (17, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 11);
INSERT INTO `t_order_item` VALUES (18, '白米饭', '主食', 5, NULL, 1, 3, 3, 11);
INSERT INTO `t_order_item` VALUES (19, '可乐', '饮品', 1, NULL, 1, 5, 5, 11);
INSERT INTO `t_order_item` VALUES (20, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 12);
INSERT INTO `t_order_item` VALUES (21, '可乐', '饮品', 1, NULL, 2, 10, 5, 12);
INSERT INTO `t_order_item` VALUES (22, '白米饭', '主食', 5, NULL, 2, 6, 3, 12);
INSERT INTO `t_order_item` VALUES (23, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 13);
INSERT INTO `t_order_item` VALUES (24, '可乐', '饮品', 1, NULL, 1, 5, 5, 13);
INSERT INTO `t_order_item` VALUES (25, '可乐', '饮品', 1, NULL, 1, 5, 5, 14);
INSERT INTO `t_order_item` VALUES (26, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 15);
INSERT INTO `t_order_item` VALUES (27, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 16);
INSERT INTO `t_order_item` VALUES (28, '白米饭', '主食', 5, NULL, 1, 3, 3, 16);
INSERT INTO `t_order_item` VALUES (29, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 17);
INSERT INTO `t_order_item` VALUES (30, '白米饭', '主食', 5, NULL, 1, 3, 3, 17);
INSERT INTO `t_order_item` VALUES (31, '可乐', '饮品', 1, NULL, 1, 5, 5, 17);
INSERT INTO `t_order_item` VALUES (32, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 18);
INSERT INTO `t_order_item` VALUES (33, '可乐', '饮品', 1, NULL, 1, 5, 5, 18);
INSERT INTO `t_order_item` VALUES (34, '白米饭', '主食', 5, NULL, 1, 3, 3, 19);
INSERT INTO `t_order_item` VALUES (35, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 20);
INSERT INTO `t_order_item` VALUES (36, '可乐', '饮品', 1, NULL, 1, 5, 5, 20);
INSERT INTO `t_order_item` VALUES (37, '白米饭', '主食', 5, NULL, 1, 3, 3, 20);
INSERT INTO `t_order_item` VALUES (38, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 21);
INSERT INTO `t_order_item` VALUES (39, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 22);
INSERT INTO `t_order_item` VALUES (40, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 23);
INSERT INTO `t_order_item` VALUES (41, '白米饭', '主食', 5, NULL, 1, 3, 3, 23);
INSERT INTO `t_order_item` VALUES (42, '可乐', '饮品', 1, NULL, 1, 5, 5, 23);
INSERT INTO `t_order_item` VALUES (43, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 24);
INSERT INTO `t_order_item` VALUES (44, '可乐', '饮品', 1, NULL, 1, 5, 5, 24);
INSERT INTO `t_order_item` VALUES (45, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 25);
INSERT INTO `t_order_item` VALUES (46, '白米饭', '主食', 5, NULL, 1, 3, 3, 25);
INSERT INTO `t_order_item` VALUES (47, '可乐', '饮品', 1, NULL, 1, 5, 5, 25);
INSERT INTO `t_order_item` VALUES (48, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 26);
INSERT INTO `t_order_item` VALUES (49, '白米饭', '主食', 5, NULL, 1, 3, 3, 26);
INSERT INTO `t_order_item` VALUES (50, '可乐', '饮品', 1, NULL, 1, 5, 5, 26);
INSERT INTO `t_order_item` VALUES (51, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 27);
INSERT INTO `t_order_item` VALUES (52, '可乐', '饮品', 1, NULL, 1, 5, 5, 27);
INSERT INTO `t_order_item` VALUES (53, '白米饭', '主食', 5, NULL, 1, 3, 3, 27);
INSERT INTO `t_order_item` VALUES (54, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 28);
INSERT INTO `t_order_item` VALUES (55, '白米饭', '主食', 5, NULL, 1, 3, 3, 28);
INSERT INTO `t_order_item` VALUES (56, '可乐', '饮品', 1, NULL, 1, 5, 5, 28);
INSERT INTO `t_order_item` VALUES (57, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 29);
INSERT INTO `t_order_item` VALUES (58, '白米饭', '主食', 5, NULL, 1, 3, 3, 29);
INSERT INTO `t_order_item` VALUES (59, '可乐', '饮品', 1, NULL, 1, 5, 5, 29);
INSERT INTO `t_order_item` VALUES (60, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 30);
INSERT INTO `t_order_item` VALUES (61, '白米饭', '主食', 5, NULL, 2, 6, 3, 30);
INSERT INTO `t_order_item` VALUES (62, '可乐', '饮品', 1, NULL, 1, 5, 5, 30);
INSERT INTO `t_order_item` VALUES (63, '白米饭', '主食', 5, NULL, 1, 3, 3, 31);
INSERT INTO `t_order_item` VALUES (64, '宫保鸡丁饭', '主食', 15, NULL, 2, 56, 28, 31);
INSERT INTO `t_order_item` VALUES (65, '可乐', '饮品', 1, NULL, 1, 5, 5, 32);
INSERT INTO `t_order_item` VALUES (66, '白米饭', '主食', 5, NULL, 1, 3, 3, 33);
INSERT INTO `t_order_item` VALUES (67, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 33);
INSERT INTO `t_order_item` VALUES (68, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 34);
INSERT INTO `t_order_item` VALUES (69, '白米饭', '主食', 5, NULL, 1, 3, 3, 34);
INSERT INTO `t_order_item` VALUES (70, '宫保鸡丁饭', '', 15, NULL, 20, 560, 28, 35);
INSERT INTO `t_order_item` VALUES (71, '白米饭', '', 15, NULL, 8, 24, 3, 35);
INSERT INTO `t_order_item` VALUES (72, '可乐', '', 15, NULL, 6, 30, 5, 35);
INSERT INTO `t_order_item` VALUES (73, '宫保鸡丁饭', '主食', 15, NULL, 117, 3276, 28, 36);
INSERT INTO `t_order_item` VALUES (74, '白米饭', '主食', 5, NULL, 3, 9, 3, 36);
INSERT INTO `t_order_item` VALUES (75, '宫保鸡丁饭', '主食', 15, NULL, 7, 196, 28, 37);
INSERT INTO `t_order_item` VALUES (76, '白米饭', '主食', 5, NULL, 4, 12, 3, 37);
INSERT INTO `t_order_item` VALUES (77, '可乐', '饮品', 1, NULL, 7, 35, 5, 37);
INSERT INTO `t_order_item` VALUES (78, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 38);
INSERT INTO `t_order_item` VALUES (79, '白米饭', '主食', 5, NULL, 1, 3, 3, 38);
INSERT INTO `t_order_item` VALUES (80, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 39);
INSERT INTO `t_order_item` VALUES (81, '白米饭', '主食', 5, NULL, 1, 3, 3, 39);
INSERT INTO `t_order_item` VALUES (82, '可乐', '饮品', 1, NULL, 1, 5, 5, 39);
INSERT INTO `t_order_item` VALUES (83, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 40);
INSERT INTO `t_order_item` VALUES (84, '白米饭', '主食', 5, NULL, 1, 3, 3, 40);
INSERT INTO `t_order_item` VALUES (85, '烤全人', '主食', 150, NULL, 1, 688, 688, 41);
INSERT INTO `t_order_item` VALUES (86, '烤全人', '主食', 150, NULL, 5, 3440, 688, 42);
INSERT INTO `t_order_item` VALUES (87, '可乐', '饮品', 1, NULL, 3, 15, 5, 42);
INSERT INTO `t_order_item` VALUES (88, '烤全人', '主食', 150, NULL, 1, 688, 688, 43);
INSERT INTO `t_order_item` VALUES (89, '烤全人', '主食', 150, NULL, 1, 688, 688, 44);
INSERT INTO `t_order_item` VALUES (90, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 44);
INSERT INTO `t_order_item` VALUES (91, '凉拌木耳', '小菜', 10, NULL, 1, 10, 10, 44);
INSERT INTO `t_order_item` VALUES (92, '可乐', '饮品', 1, NULL, 1, 5, 5, 44);
INSERT INTO `t_order_item` VALUES (93, '刺客意面', '主食', 15, NULL, 3, 117, 39, 45);
INSERT INTO `t_order_item` VALUES (94, '可乐', '饮品', 1, NULL, 3, 15, 5, 45);
INSERT INTO `t_order_item` VALUES (95, '杨枝甘露', '甜品', 15, NULL, 1, 10, 10, 46);
INSERT INTO `t_order_item` VALUES (96, '白米饭', '主食', 5, NULL, 1, 3, 3, 46);
INSERT INTO `t_order_item` VALUES (97, '烤全人', '主食', 150, NULL, 1, 688, 688, 46);
INSERT INTO `t_order_item` VALUES (98, '刺客意面', '主食', 15, NULL, 1, 39, 39, 46);
INSERT INTO `t_order_item` VALUES (99, '凉拌木耳', '小菜', 10, NULL, 1, 10, 10, 46);
INSERT INTO `t_order_item` VALUES (100, '无糖可乐', '饮品', 10, NULL, 1, 5, 5, 46);
INSERT INTO `t_order_item` VALUES (101, '可乐', '饮品', 1, NULL, 1, 5, 5, 46);
INSERT INTO `t_order_item` VALUES (102, '水煮白菜汤', '汤品', 25, NULL, 1, 25, 25, 46);
INSERT INTO `t_order_item` VALUES (103, '宫保鸡丁饭', '主食', 15, NULL, 1, 28, 28, 46);
INSERT INTO `t_order_item` VALUES (104, '烤全人', '主食', 150, NULL, 1, 688, 688, 47);
INSERT INTO `t_order_item` VALUES (105, '刺客意面', '主食', 15, NULL, 1, 39, 39, 47);
INSERT INTO `t_order_item` VALUES (106, '刺客意面', '主食', 15, NULL, 1, 39, 39, 48);
INSERT INTO `t_order_item` VALUES (107, '刺客意面', '主食', 15, NULL, 1, 39, 39, 49);
INSERT INTO `t_order_item` VALUES (108, '刺客意面', '主食', 15, NULL, 1, 39, 39, 50);

-- ----------------------------
-- Table structure for t_order_new
-- ----------------------------
DROP TABLE IF EXISTS `t_order_new`;
CREATE TABLE `t_order_new`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `order_status` enum('CANCELLED','COMPLETED','CONFIRMED','PENDING','PREPARING','READY') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pickup_code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue_number` int NULL DEFAULT NULL,
  `total_estimated_time` int NULL DEFAULT NULL,
  `total_price` double NOT NULL,
  `updated_at` datetime(6) NULL DEFAULT NULL,
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UKhund7xt9ymjtyhak9q1vjb4tm`(`pickup_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 51 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_order_new
-- ----------------------------
INSERT INTO `t_order_new` VALUES (1, '2025-09-18 17:31:42.439000', '????', 'COMPLETED', '312633', 36, 15, 61, '2025-09-18 17:33:29.051000', 'user123');
INSERT INTO `t_order_new` VALUES (2, '2025-09-18 17:31:54.513000', '??', 'COMPLETED', '127376', 70, 15, 28, '2025-09-18 17:54:50.076000', 'user456');
INSERT INTO `t_order_new` VALUES (3, '2025-09-18 17:55:17.129000', NULL, 'COMPLETED', '845405', 56, 12, 28, '2025-09-18 17:55:28.536000', 'user123');
INSERT INTO `t_order_new` VALUES (4, '2025-09-18 17:55:28.105000', '????', 'READY', '718573', 62, 12, 31, '2025-09-18 17:56:08.580000', 'test_user');
INSERT INTO `t_order_new` VALUES (5, '2025-09-18 17:56:11.902000', NULL, 'READY', '303257', 57, 12, 28, '2025-09-18 17:56:22.085000', 'user123');
INSERT INTO `t_order_new` VALUES (6, '2025-09-18 18:03:34.593000', NULL, 'READY', '594443', 65, 15, 36, '2025-09-18 18:05:10.558000', 'user123');
INSERT INTO `t_order_new` VALUES (7, '2025-09-18 18:05:00.099000', '??????????', 'READY', '465706', 9, 15, 56, '2025-09-18 18:05:12.548000', 'user123');
INSERT INTO `t_order_new` VALUES (8, '2025-09-18 18:05:54.211000', NULL, 'READY', '056437', 38, 15, 36, '2025-09-18 18:06:07.871000', 'user123');
INSERT INTO `t_order_new` VALUES (9, '2025-09-18 18:06:28.138000', NULL, 'READY', '251604', 81, 15, 560, '2025-09-18 18:11:10.309000', 'user123');
INSERT INTO `t_order_new` VALUES (10, '2025-09-18 18:21:49.538000', NULL, 'READY', '978357', 30, 15, 33, '2025-09-18 20:12:37.478000', 'user123');
INSERT INTO `t_order_new` VALUES (11, '2025-09-18 18:26:38.717000', NULL, 'READY', '581467', 4, 15, 36, '2025-09-18 18:26:50.326000', 'user123');
INSERT INTO `t_order_new` VALUES (12, '2025-09-18 18:27:08.717000', NULL, 'READY', '041377', 71, 15, 44, '2025-09-18 20:12:38.770000', 'user123');
INSERT INTO `t_order_new` VALUES (13, '2025-09-19 13:31:33.298000', NULL, 'READY', '852417', 22, 15, 33, '2025-09-19 13:31:38.074000', 'user123');
INSERT INTO `t_order_new` VALUES (14, '2025-09-19 13:32:58.993000', NULL, 'READY', '056830', 48, 1, 5, '2025-09-19 13:33:53.797000', 'user123');
INSERT INTO `t_order_new` VALUES (15, '2025-09-19 13:40:51.640000', NULL, 'READY', '066787', 87, 15, 28, '2025-09-19 14:02:15.401000', 'user123');
INSERT INTO `t_order_new` VALUES (16, '2025-09-19 14:08:26.791000', NULL, 'READY', '304821', 99, 15, 31, '2025-09-19 14:09:02.058000', 'user123');
INSERT INTO `t_order_new` VALUES (17, '2025-09-19 14:11:05.866000', NULL, 'READY', '527585', 29, 15, 36, '2025-09-19 14:11:46.063000', 'user123');
INSERT INTO `t_order_new` VALUES (18, '2025-09-19 14:11:13.266000', NULL, 'READY', '479185', 98, 15, 33, '2025-09-19 14:11:46.669000', 'user123');
INSERT INTO `t_order_new` VALUES (19, '2025-09-19 14:11:51.963000', NULL, 'READY', '684339', 97, 5, 3, '2025-09-19 14:11:55.870000', 'user123');
INSERT INTO `t_order_new` VALUES (20, '2025-09-19 14:11:58.516000', NULL, 'READY', '804258', 68, 15, 36, '2025-09-19 14:18:20.536000', 'user123');
INSERT INTO `t_order_new` VALUES (21, '2025-09-19 14:17:45.972000', NULL, 'READY', '235429', 80, 15, 28, '2025-09-19 14:18:21.745000', 'user123');
INSERT INTO `t_order_new` VALUES (22, '2025-09-19 14:17:51.180000', NULL, 'READY', '600280', 92, 15, 28, '2025-09-19 14:18:22.801000', 'user123');
INSERT INTO `t_order_new` VALUES (23, '2025-09-19 14:20:33.713000', NULL, 'READY', '285928', 73, 15, 36, '2025-09-19 14:20:45.998000', 'user123');
INSERT INTO `t_order_new` VALUES (24, '2025-09-19 14:30:18.669000', NULL, 'READY', '106585', 14, 15, 33, '2025-09-19 14:30:25.967000', 'user123');
INSERT INTO `t_order_new` VALUES (25, '2025-09-19 14:30:35.837000', NULL, 'READY', '686211', 68, 15, 36, '2025-09-19 14:30:41.949000', 'user123');
INSERT INTO `t_order_new` VALUES (26, '2025-09-19 14:30:45.371000', NULL, 'READY', '911941', 97, 15, 36, '2025-09-19 14:30:56.453000', 'user123');
INSERT INTO `t_order_new` VALUES (27, '2025-09-19 14:30:59.971000', NULL, 'READY', '255200', 68, 15, 36, '2025-09-19 14:31:08.173000', 'user123');
INSERT INTO `t_order_new` VALUES (28, '2025-09-19 14:31:11.619000', NULL, 'READY', '778918', 57, 15, 36, '2025-09-19 14:36:39.446000', 'user123');
INSERT INTO `t_order_new` VALUES (29, '2025-09-19 14:34:27.353000', NULL, 'READY', '090494', 94, 15, 36, '2025-09-19 14:34:31.276000', 'user123');
INSERT INTO `t_order_new` VALUES (30, '2025-09-19 14:34:34.528000', NULL, 'READY', '674842', 42, 15, 39, '2025-09-19 14:39:53.859000', 'user123');
INSERT INTO `t_order_new` VALUES (31, '2025-09-19 14:34:38.416000', NULL, 'READY', '514366', 16, 15, 59, '2025-09-19 14:39:52.133000', 'user123');
INSERT INTO `t_order_new` VALUES (32, '2025-09-19 14:34:57.377000', NULL, 'READY', '671780', 42, 1, 5, '2025-09-19 14:39:54.769000', 'user123');
INSERT INTO `t_order_new` VALUES (33, '2025-09-19 14:36:42.565000', NULL, 'READY', '947467', 48, 15, 31, '2025-09-19 14:39:55.282000', 'user123');
INSERT INTO `t_order_new` VALUES (34, '2025-09-19 14:39:48.429000', NULL, 'READY', '993189', 92, 15, 31, '2025-09-19 14:39:56.122000', '');
INSERT INTO `t_order_new` VALUES (35, '2025-09-19 14:41:27.506000', NULL, 'READY', '651245', 69, 15, 614, '2025-09-19 14:41:29.469000', 'user123');
INSERT INTO `t_order_new` VALUES (36, '2025-09-19 14:51:35.339000', NULL, 'COMPLETED', '266583', 58, 15, 3285, '2025-09-19 14:53:28.280000', 'user123');
INSERT INTO `t_order_new` VALUES (37, '2025-09-19 14:54:36.359000', NULL, 'READY', '361654', 58, 15, 243, '2025-09-19 14:58:13.400000', 'user123');
INSERT INTO `t_order_new` VALUES (38, '2025-09-19 14:55:32.418000', NULL, 'READY', '893161', 83, 15, 31, '2025-09-19 14:58:10.543000', 'user123');
INSERT INTO `t_order_new` VALUES (39, '2025-09-19 14:58:17.647000', NULL, 'READY', '289916', 52, 15, 36, '2025-09-19 14:58:42.584000', 'user123');
INSERT INTO `t_order_new` VALUES (40, '2025-09-19 15:21:08.494000', NULL, 'READY', '026661', 58, 15, 31, '2025-09-19 15:22:17.391000', 'user123');
INSERT INTO `t_order_new` VALUES (41, '2025-09-19 15:36:15.018000', NULL, 'READY', '771586', 11, 150, 688, '2025-09-19 15:46:08.551000', 'user123');
INSERT INTO `t_order_new` VALUES (42, '2025-09-19 18:02:34.412000', NULL, 'READY', '811976', 75, 150, 3455, '2025-09-19 18:03:01.691000', 'wangjunhan');
INSERT INTO `t_order_new` VALUES (43, '2025-09-19 18:08:22.063000', NULL, 'READY', '306204', 53, 150, 688, '2025-09-19 18:08:30.338000', 'user123');
INSERT INTO `t_order_new` VALUES (44, '2025-09-20 21:06:09.081000', NULL, 'READY', '802242', 91, 150, 731, '2025-09-20 21:06:27.314000', 'user123');
INSERT INTO `t_order_new` VALUES (45, '2025-09-23 14:10:44.938000', NULL, 'READY', '961234', 36, 15, 132, '2025-09-23 14:10:52.181000', 'user123');
INSERT INTO `t_order_new` VALUES (46, '2025-09-23 14:23:11.920000', NULL, 'READY', '794875', 28, 150, 813, '2025-09-23 14:23:20.577000', 'user123');
INSERT INTO `t_order_new` VALUES (47, '2025-09-26 15:09:25.973000', NULL, 'READY', '699799', 8, 150, 727, '2025-09-26 16:19:23.234000', 'user123');
INSERT INTO `t_order_new` VALUES (48, '2025-09-26 16:19:27.395000', NULL, 'READY', '267206', 97, 15, 39, '2025-09-26 16:22:19.472000', 'user123');
INSERT INTO `t_order_new` VALUES (49, '2025-09-26 16:22:22.485000', NULL, 'READY', '459388', 58, 15, 39, '2025-09-26 16:22:26.400000', 'user123');
INSERT INTO `t_order_new` VALUES (50, '2025-09-26 16:22:30.117000', NULL, 'PENDING', '502897', 85, 15, 39, '2025-09-26 16:22:30.117000', 'user123');

-- ----------------------------
-- View structure for v_index_usage
-- ----------------------------
DROP VIEW IF EXISTS `v_index_usage`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_index_usage` AS select `performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_SCHEMA` AS `database_name`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_NAME` AS `table_name`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`INDEX_NAME` AS `index_name`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_FETCH` AS `select_count`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_INSERT` AS `insert_count`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_UPDATE` AS `update_count`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_DELETE` AS `delete_count` from `performance_schema`.`table_io_waits_summary_by_index_usage` where (`performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_SCHEMA` not in ('information_schema','mysql','performance_schema','sys')) order by `performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_FETCH` desc;

-- ----------------------------
-- View structure for v_order_details
-- ----------------------------
DROP VIEW IF EXISTS `v_order_details`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_order_details` AS select `o`.`order_id` AS `order_id`,`o`.`store_id` AS `store_id`,`o`.`order_number` AS `order_number`,`o`.`total_amount` AS `total_amount`,`o`.`status` AS `order_status`,`o`.`payment_status` AS `payment_status`,`o`.`created_at` AS `created_at`,concat(`u`.`first_name`,' ',`u`.`last_name`) AS `cashier_name`,`c`.`customer_name` AS `customer_name`,`c`.`phone` AS `customer_phone`,count(`oi`.`order_item_id`) AS `item_count`,sum(`oi`.`quantity`) AS `total_quantity` from (((`orders` `o` left join `users` `u` on((`o`.`user_id` = `u`.`user_id`))) left join `customers` `c` on((`o`.`customer_id` = `c`.`customer_id`))) left join `order_items` `oi` on(((`o`.`order_id` = `oi`.`order_id`) and (`oi`.`is_deleted` = false)))) where (`o`.`is_deleted` = false) group by `o`.`order_id`,`o`.`store_id`,`o`.`order_number`,`o`.`total_amount`,`o`.`status`,`o`.`payment_status`,`o`.`created_at`,`u`.`first_name`,`u`.`last_name`,`c`.`customer_name`,`c`.`phone`;

-- ----------------------------
-- View structure for v_product_inventory
-- ----------------------------
DROP VIEW IF EXISTS `v_product_inventory`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_product_inventory` AS select `p`.`product_id` AS `product_id`,`p`.`store_id` AS `store_id`,`p`.`product_name` AS `product_name`,`p`.`price` AS `price`,`c`.`category_name` AS `category_name`,`i`.`current_stock` AS `current_stock`,`i`.`min_stock` AS `min_stock`,`i`.`max_stock` AS `max_stock`,`i`.`cost_price` AS `cost_price`,(case when (`i`.`current_stock` <= `i`.`min_stock`) then 'LOW_STOCK' when (`i`.`current_stock` >= `i`.`max_stock`) then 'OVERSTOCK' else 'NORMAL' end) AS `stock_status`,`p`.`is_active` AS `is_active`,`p`.`updated_at` AS `updated_at` from ((`products` `p` join `categories` `c` on((`p`.`category_id` = `c`.`category_id`))) join `inventory` `i` on((`p`.`product_id` = `i`.`product_id`))) where ((`p`.`is_deleted` = false) and (`c`.`is_deleted` = false) and (`i`.`is_deleted` = false));

-- ----------------------------
-- View structure for v_slow_queries
-- ----------------------------
DROP VIEW IF EXISTS `v_slow_queries`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_slow_queries` AS select `performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT` AS `query_text`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,(`performance_schema`.`events_statements_summary_by_digest`.`AVG_TIMER_WAIT` / 1000000000000) AS `avg_time_sec`,(`performance_schema`.`events_statements_summary_by_digest`.`MAX_TIMER_WAIT` / 1000000000000) AS `max_time_sec`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_EXAMINED` AS `total_rows_examined`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_SENT` AS `total_rows_sent`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `FIRST_SEEN`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `LAST_SEEN` from `performance_schema`.`events_statements_summary_by_digest` where (`performance_schema`.`events_statements_summary_by_digest`.`AVG_TIMER_WAIT` > 2000000000000) order by `performance_schema`.`events_statements_summary_by_digest`.`AVG_TIMER_WAIT` desc limit 20;

-- ----------------------------
-- View structure for v_table_space_usage
-- ----------------------------
DROP VIEW IF EXISTS `v_table_space_usage`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_table_space_usage` AS select `information_schema`.`tables`.`TABLE_SCHEMA` AS `database_name`,`information_schema`.`tables`.`TABLE_NAME` AS `table_name`,round((((`information_schema`.`tables`.`DATA_LENGTH` + `information_schema`.`tables`.`INDEX_LENGTH`) / 1024) / 1024),2) AS `size_mb`,`information_schema`.`tables`.`TABLE_ROWS` AS `row_count`,round(((`information_schema`.`tables`.`DATA_LENGTH` + `information_schema`.`tables`.`INDEX_LENGTH`) / `information_schema`.`tables`.`TABLE_ROWS`),2) AS `avg_row_size`,`information_schema`.`tables`.`ENGINE` AS `ENGINE` from `information_schema`.`TABLES` where (`information_schema`.`tables`.`TABLE_SCHEMA` not in ('information_schema','mysql','performance_schema','sys')) order by (`information_schema`.`tables`.`DATA_LENGTH` + `information_schema`.`tables`.`INDEX_LENGTH`) desc;

-- ----------------------------
-- View structure for v_user_permissions
-- ----------------------------
DROP VIEW IF EXISTS `v_user_permissions`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_user_permissions` AS select `u`.`user_id` AS `user_id`,`u`.`store_id` AS `store_id`,`u`.`email` AS `email`,`u`.`first_name` AS `first_name`,`u`.`last_name` AS `last_name`,`r`.`role_name` AS `role_name`,`p`.`permission_code` AS `permission_code`,`p`.`resource` AS `resource`,`p`.`action` AS `action` from ((((`users` `u` join `user_roles` `ur` on(((`u`.`user_id` = `ur`.`user_id`) and (`ur`.`is_active` = true)))) join `roles` `r` on(((`ur`.`role_id` = `r`.`role_id`) and (`r`.`is_active` = true)))) join `role_permissions` `rp` on((`r`.`role_id` = `rp`.`role_id`))) join `permissions` `p` on((`rp`.`permission_id` = `p`.`permission_id`))) where ((`u`.`is_deleted` = false) and (`r`.`is_deleted` = false) and (`p`.`is_deleted` = false));

-- ----------------------------
-- Procedure structure for sp_check_inventory_alerts
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_check_inventory_alerts`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_check_inventory_alerts`(
    IN p_store_id CHAR(36)
)
BEGIN
    SELECT 
        p.id as product_id,
        p.product_name,
        i.current_stock,
        i.min_stock,
        c.category_name
    FROM inventory i
    JOIN products p ON i.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE p.store_id = p_store_id
      AND i.current_stock <= i.min_stock
      AND p.is_active = TRUE
      AND p.is_deleted = FALSE
    ORDER BY (i.current_stock / NULLIF(i.min_stock, 0)) ASC;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_check_user_permission
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_check_user_permission`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_check_user_permission`(
    IN p_user_id CHAR(36),
    IN p_resource VARCHAR(50),
    IN p_action VARCHAR(50),
    OUT p_has_permission BOOLEAN
)
BEGIN
    DECLARE permission_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO permission_count
    FROM users u
    JOIN user_roles ur ON u.user_id = ur.user_id
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.permission_id
    WHERE u.user_id = p_user_id
      AND p.resource = p_resource
      AND p.action = p_action
      AND u.is_deleted = FALSE
      AND ur.is_active = TRUE
      AND p.is_deleted = FALSE;
    
    SET p_has_permission = (permission_count > 0);
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_generate_daily_sales_report
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_generate_daily_sales_report`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_generate_daily_sales_report`(
    IN p_store_id CHAR(36),
    IN p_report_date DATE
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    DELETE FROM daily_sales_reports 
    WHERE store_id = p_store_id AND report_date = p_report_date;
    
    INSERT INTO daily_sales_reports (
        store_id, report_date, total_sales_amount, total_orders, 
        average_order_value, total_tips, top_product_id, created_by
    )
    SELECT 
        p_store_id,
        p_report_date,
        IFNULL(SUM(o.total_amount), 0) as total_sales_amount,
        COUNT(o.order_id) as total_orders,
        IFNULL(AVG(o.total_amount), 0) as average_order_value,
        IFNULL(SUM(o.tip_amount), 0) as total_tips,
        (SELECT oi.product_id 
         FROM order_items oi 
         JOIN orders o2 ON oi.order_id = o2.order_id 
         WHERE o2.store_id = p_store_id 
           AND DATE(o2.created_at) = p_report_date
           AND o2.status = 'COMPLETED'
           AND oi.is_deleted = FALSE
         GROUP BY oi.product_id 
         ORDER BY SUM(oi.quantity) DESC 
         LIMIT 1) as top_product_id,
        1 as created_by
    FROM orders o
    WHERE o.store_id = p_store_id 
      AND DATE(o.created_at) = p_report_date
      AND o.status = 'COMPLETED'
      AND o.is_deleted = FALSE;
    
    COMMIT;
END
;;
delimiter ;

-- ----------------------------
-- Event structure for ev_cleanup_expired_sessions
-- ----------------------------
DROP EVENT IF EXISTS `ev_cleanup_expired_sessions`;
delimiter ;;
CREATE EVENT `ev_cleanup_expired_sessions`
ON SCHEDULE
EVERY '1' HOUR STARTS '2025-09-20 21:20:22'
DO BEGIN
    -- 清理过期的用户会话
    DELETE FROM user_sessions 
    WHERE (access_token_expires_at < NOW() - INTERVAL 1 DAY)
       OR (refresh_token_expires_at < NOW() - INTERVAL 7 DAY)
       OR (status = 'INACTIVE' AND updated_at < NOW() - INTERVAL 1 DAY);
    
    -- 清理过期的商家会话
    DELETE FROM merchant_sessions 
    WHERE (access_token_expires_at < NOW() - INTERVAL 1 DAY)
       OR (refresh_token_expires_at < NOW() - INTERVAL 7 DAY)
       OR (status = 'INACTIVE' AND updated_at < NOW() - INTERVAL 1 DAY);
END
;;
delimiter ;

-- ----------------------------
-- Event structure for ev_cleanup_old_notifications
-- ----------------------------
DROP EVENT IF EXISTS `ev_cleanup_old_notifications`;
delimiter ;;
CREATE EVENT `ev_cleanup_old_notifications`
ON SCHEDULE
EVERY '1' DAY STARTS '2025-09-21 04:00:00'
DO BEGIN
    DELETE FROM notifications 
    WHERE is_read = TRUE 
      AND read_at < NOW() - INTERVAL 30 DAY;
END
;;
delimiter ;

-- ----------------------------
-- Event structure for ev_daily_sales_report
-- ----------------------------
DROP EVENT IF EXISTS `ev_daily_sales_report`;
delimiter ;;
CREATE EVENT `ev_daily_sales_report`
ON SCHEDULE
EVERY '1' DAY STARTS '2025-09-21 01:00:00'
DO BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_store_id CHAR(36);
    DECLARE store_cursor CURSOR FOR 
        SELECT id FROM stores WHERE status = 'ACTIVE' AND is_deleted = FALSE;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN store_cursor;
    store_loop: LOOP
        FETCH store_cursor INTO v_store_id;
        IF done THEN
            LEAVE store_loop;
        END IF;
        
        CALL sp_generate_daily_sales_report(v_store_id, CURDATE() - INTERVAL 1 DAY);
    END LOOP;
    CLOSE store_cursor;
END
;;
delimiter ;

-- ----------------------------
-- Event structure for ev_inventory_alert_check
-- ----------------------------
DROP EVENT IF EXISTS `ev_inventory_alert_check`;
delimiter ;;
CREATE EVENT `ev_inventory_alert_check`
ON SCHEDULE
EVERY '1' HOUR STARTS '2025-09-20 21:20:22'
DO BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_store_id CHAR(36);
    DECLARE v_product_name VARCHAR(200);
    DECLARE v_current_stock INT;
    DECLARE v_min_stock INT;
    DECLARE store_cursor CURSOR FOR 
        SELECT id FROM stores WHERE status = 'ACTIVE' AND is_deleted = FALSE;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN store_cursor;
    store_loop: LOOP
        FETCH store_cursor INTO v_store_id;
        IF done THEN
            LEAVE store_loop;
        END IF;
        
        INSERT INTO notifications (store_id, title, message, type, created_by)
        SELECT 
            v_store_id,
            '库存预警',
            CONCAT('商品 "', p.product_name, '" 库存不足，当前库存：', i.current_stock, '，最低库存：', i.min_stock),
            'INVENTORY_ALERT',
            1
        FROM inventory i
        JOIN products p ON i.product_id = p.product_id
        WHERE p.store_id = v_store_id
          AND i.current_stock <= i.min_stock
          AND p.is_active = TRUE
          AND p.is_deleted = FALSE
          AND i.is_deleted = FALSE;
    END LOOP;
    CLOSE store_cursor;
END
;;
delimiter ;

-- ----------------------------
-- Event structure for ev_monitor_connections
-- ----------------------------
DROP EVENT IF EXISTS `ev_monitor_connections`;
delimiter ;;
CREATE EVENT `ev_monitor_connections`
ON SCHEDULE
EVERY '5' MINUTE STARTS '2025-09-20 21:20:22'
DO BEGIN
    DECLARE current_connections INT;
    DECLARE max_connections_limit INT;
    
    SELECT VARIABLE_VALUE INTO current_connections 
    FROM performance_schema.global_status 
    WHERE VARIABLE_NAME = 'Threads_connected';
    
    SELECT @@max_connections INTO max_connections_limit;
    
    IF current_connections > max_connections_limit * 0.8 THEN
        INSERT INTO system_alerts (alert_type, alert_level, alert_message, alert_data)
        VALUES (
            'HIGH_CONNECTIONS', 
            'WARNING',
            CONCAT('数据库连接数过高: ', current_connections, '/', max_connections_limit),
            JSON_OBJECT('current_connections', current_connections, 'max_connections', max_connections_limit)
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Event structure for ev_weekly_stats_update
-- ----------------------------
DROP EVENT IF EXISTS `ev_weekly_stats_update`;
delimiter ;;
CREATE EVENT `ev_weekly_stats_update`
ON SCHEDULE
EVERY '1' WEEK STARTS '2025-09-22 03:00:00'
DO BEGIN
    ANALYZE TABLE stores, users, products, categories, inventory, 
                 orders, order_items, payments, customers, coupons;
    
    INSERT INTO performance_metrics (metric_id, metric_name, metric_value, measured_at)
    SELECT 
        CONCAT('MET-', UNIX_TIMESTAMP(NOW()), '-001'),
        'avg_order_processing_time',
        AVG(TIMESTAMPDIFF(SECOND, created_at, updated_at)),
        NOW()
    FROM orders 
    WHERE created_at >= CURDATE() - INTERVAL 7 DAY
      AND status = 'COMPLETED';
      
    INSERT INTO performance_metrics (metric_id, metric_name, metric_value, measured_at)
    SELECT 
        CONCAT('MET-', UNIX_TIMESTAMP(NOW()), '-002'),
        'daily_order_count',
        COUNT(*) / 7.0,
        NOW()
    FROM orders 
    WHERE created_at >= CURDATE() - INTERVAL 7 DAY;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
