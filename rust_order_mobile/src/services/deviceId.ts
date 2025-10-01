import { Platform } from 'react-native';

let SecureStore: any = null;
let Application: any = null;
let AsyncStorage: any = null;

try {
  if (Platform.OS !== 'web') {
    SecureStore = require('expo-secure-store');
  }
} catch (error) {
  console.warn('SecureStore not available:', error);
}

try {
  if (Platform.OS !== 'web') {
    Application = require('expo-application');
  }
} catch (error) {
  console.warn('Application not available:', error);
}

try {
  if (Platform.OS !== 'web') {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  }
} catch (error) {
  console.warn('AsyncStorage not available:', error);
}

const DEVICE_ID_KEY = 'secure_device_id';
const USER_ID_KEY = '@rust_order_user_id';

const generateSimpleUUID = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  const randomPart2 = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${randomPart}-${randomPart2}`;
};

export const getDeviceId = async (): Promise<string> => {
  try {
    if (Platform.OS === 'android' && Application) {
      // Android: 使用系统提供的Android ID
      const androidId = await Application.getAndroidId();
      if (androidId) {
        return `android_${androidId}`;
      }
      // 如果获取失败，回退到UUID方案
      return await getStoredOrGenerateUUID();
    } else if (Platform.OS === 'ios') {
      // iOS: 使用SecureStore存储UUID
      return await getStoredOrGenerateUUID(true);
    } else if (Platform.OS === 'web') {
      // Web: 使用localStorage
      if (typeof window !== 'undefined') {
        let deviceId = localStorage.getItem(DEVICE_ID_KEY);
        if (!deviceId) {
          deviceId = `web_${generateSimpleUUID()}`;
          localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }
        return deviceId;
      } else {
        // 服务器端渲染环境
        return 'web_ssr_default';
      }
    }
    
    // 其他平台回退方案
    return await getStoredOrGenerateUUID();
  } catch (error) {
    console.error('获取设备ID失败:', error);
    // 错误时回退到时间戳方案
    return `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

const getStoredOrGenerateUUID = async (useSecureStore: boolean = false): Promise<string> => {
  try {
    let storedId: string | null = null;
    
    if (useSecureStore && Platform.OS === 'ios' && SecureStore) {
      // iOS使用SecureStore
      storedId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
      if (!storedId) {
        storedId = `ios_${generateSimpleUUID()}`;
        await SecureStore.setItemAsync(DEVICE_ID_KEY, storedId);
      }
    } else if (AsyncStorage) {
      // 其他平台使用AsyncStorage
      storedId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (!storedId) {
        storedId = `mobile_${generateSimpleUUID()}`;
        await AsyncStorage.setItem(DEVICE_ID_KEY, storedId);
      }
    } else {
      // 无存储可用时的回退方案
      storedId = `temp_${generateSimpleUUID()}`;
    }
    
    return storedId;
  } catch (error) {
    console.error('存储设备ID失败:', error);
    return `error_${generateSimpleUUID()}`;
  }
};

export const getUserId = async (): Promise<string> => {
  try {
    // 首先尝试从存储中获取已有的用户ID
    let existingUserId: string | null = null;
    
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        existingUserId = localStorage.getItem(USER_ID_KEY);
      }
    } else if (AsyncStorage) {
      existingUserId = await AsyncStorage.getItem(USER_ID_KEY);
    }
    
    // 如果已有用户ID且不是临时ID，继续使用
    if (existingUserId && !existingUserId.startsWith('user_') && !existingUserId.includes('user123')) {
      return existingUserId;
    }
    
    // 获取设备ID作为用户标识
    const deviceId = await getDeviceId();
    const userId = `user_${deviceId}`;
    
    // 保存新的用户ID
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_ID_KEY, userId);
      }
    } else if (AsyncStorage) {
      await AsyncStorage.setItem(USER_ID_KEY, userId);
    }
    
    return userId;
  } catch (error) {
    console.error('获取用户ID失败:', error);
    // 错误时回退到原有方案
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

export const clearDeviceId = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DEVICE_ID_KEY);
        localStorage.removeItem(USER_ID_KEY);
      }
    } else if (Platform.OS === 'ios') {
      await SecureStore.deleteItemAsync(DEVICE_ID_KEY);
      if (AsyncStorage) {
        await AsyncStorage.removeItem(USER_ID_KEY);
      }
    } else if (AsyncStorage) {
      await AsyncStorage.removeItem(DEVICE_ID_KEY);
      await AsyncStorage.removeItem(USER_ID_KEY);
    }
  } catch (error) {
    console.error('清除设备ID失败:', error);
  }
};

export const getDeviceInfo = async () => {
  try {
    const deviceId = await getDeviceId();
    const userId = await getUserId();
    
    return {
      platform: Platform.OS,
      deviceId,
      userId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('获取设备信息失败:', error);
    return null;
  }
};