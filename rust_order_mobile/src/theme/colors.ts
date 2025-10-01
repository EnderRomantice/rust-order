// Twitter 风格颜色主题配置
export const colors = {
  // 主色调 - 推特蓝
  primary: {
    main: '#1DA1F2',
    light: '#71C9F8',
    dark: '#1991DA',
    contrastText: '#FFFFFF',
  },
  
  // 次要色调 - 深灰
  secondary: {
    main: '#536471',
    light: '#8B98A5',
    dark: '#3C4043',
    contrastText: '#FFFFFF',
  },
  
  // 成功色 - 推特绿
  success: {
    main: '#00BA7C',
    light: '#4DD4AC',
    dark: '#00A368',
    contrastText: '#FFFFFF',
  },
  
  // 警告色 - 推特黄
  warning: {
    main: '#FFD400',
    light: '#FFED4A',
    dark: '#F7B801',
    contrastText: '#000000',
  },
  
  // 错误色 - 推特红
  error: {
    main: '#F91880',
    light: '#FF69B4',
    dark: '#E1306C',
    contrastText: '#FFFFFF',
  },
  
  // 信息色 - 推特蓝
  info: {
    main: '#1DA1F2',
    light: '#71C9F8',
    dark: '#1991DA',
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
  
  // 背景色 - 推特风格
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    disabled: '#F7F9FA',
    hover: '#F7F9FA',
  },
  
  // 文本色 - 推特风格
  text: {
    primary: '#0F1419',
    secondary: '#536471',
    disabled: '#8B98A5',
    hint: '#8B98A5',
  },
  
  // 分割线 - 推特风格
  divider: '#EFF3F4',
  
  // 覆盖层
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // 阴影
  shadow: '#000000',
};

// 食品相关颜色 - 推特风格
export const foodColors = {
  // 菜品分类颜色
  categories: {
    hot: '#F91880', // 热菜 - 推特红
    cold: '#1DA1F2', // 凉菜 - 推特蓝
    soup: '#00BA7C', // 汤类 - 推特绿
    staple: '#FFD400', // 主食 - 推特黄
    dessert: '#FF69B4', // 甜品 - 浅红
    drink: '#71C9F8', // 饮品 - 浅蓝
  },
  
  // 订单状态颜色
  orderStatus: {
    pending: '#FFD400', // 待处理 - 推特黄
    confirmed: '#1DA1F2', // 已确认 - 推特蓝
    preparing: '#F91880', // 制作中 - 推特红
    ready: '#00BA7C', // 已完成 - 推特绿
    completed: '#536471', // 已取餐 - 推特灰
    cancelled: '#F91880', // 已取消 - 推特红
  },
};

export default colors;