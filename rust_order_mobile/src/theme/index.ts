// 主题统一导出
export { colors, foodColors } from './colors';
export { typography, spacing, borderRadius, shadows } from './typography';

// 创建完整的主题对象
import { colors, foodColors } from './colors';
import { typography, spacing, borderRadius, shadows } from './typography';

export const theme = {
  colors,
  foodColors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export default theme;