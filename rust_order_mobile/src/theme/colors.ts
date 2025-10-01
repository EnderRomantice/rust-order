// Material Design 颜色主题配置
export const colors = {
  // 主色调
  primary: {
    main: '#1976D2',
    light: '#42A5F5',
    dark: '#1565C0',
    contrastText: '#FFFFFF',
  },
  
  // 次要色调
  secondary: {
    main: '#DC004E',
    light: '#FF5983',
    dark: '#9A0036',
    contrastText: '#FFFFFF',
  },
  
  // 成功色
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },
  
  // 警告色
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#000000',
  },
  
  // 错误色
  error: {
    main: '#F44336',
    light: '#EF5350',
    dark: '#D32F2F',
    contrastText: '#FFFFFF',
  },
  
  // 信息色
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  
  // 灰度色
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // 背景色
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
    disabled: '#F5F5F5',
  },
  
  // 文本色
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    hint: '#9E9E9E',
  },
  
  // 分割线
  divider: '#E0E0E0',
  
  // 覆盖层
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // 阴影
  shadow: '#000000',
};

// 食品相关颜色
export const foodColors = {
  // 菜品分类颜色
  categories: {
    hot: '#FF5722', // 热菜
    cold: '#2196F3', // 凉菜
    soup: '#4CAF50', // 汤类
    staple: '#FF9800', // 主食
    dessert: '#E91E63', // 甜品
    drink: '#9C27B0', // 饮品
  },
  
  // 订单状态颜色
  orderStatus: {
    pending: '#FF9800',
    confirmed: '#2196F3',
    preparing: '#FF5722',
    ready: '#4CAF50',
    completed: '#9E9E9E',
    cancelled: '#F44336',
  },
};

export default colors;