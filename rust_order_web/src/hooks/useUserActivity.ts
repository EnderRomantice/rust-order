import { useState, useEffect, useRef } from 'react';

/**
 * 用户活动检测Hook
 * 用于检测用户是否正在进行表单操作，以智能控制自动刷新
 */
export const useUserActivity = (inactivityDelay: number = 5000) => {
  const [isUserActive, setIsUserActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetActivityTimer = () => {
    setIsUserActive(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, inactivityDelay);
  };

  useEffect(() => {
    // 监听用户交互事件
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus',
      'input',
      'change'
    ];

    const handleActivity = () => {
      resetActivityTimer();
    };

    // 添加事件监听器
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // 初始化计时器
    resetActivityTimer();

    return () => {
      // 清理事件监听器
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inactivityDelay]);

  return isUserActive;
};

/**
 * 智能刷新Hook
 * 结合用户活动检测，智能控制自动刷新
 */
export const useSmartRefresh = (
  refreshFunction: () => void | Promise<void>,
  interval: number = 30000,
  inactivityDelay: number = 5000
) => {
  const isUserActive = useUserActivity(inactivityDelay);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(Date.now());

  useEffect(() => {
    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        // 只有在用户不活跃时才自动刷新
        if (!isUserActive) {
          const now = Date.now();
          // 确保距离上次刷新至少过了指定间隔
          if (now - lastRefreshRef.current >= interval) {
            refreshFunction();
            lastRefreshRef.current = now;
          }
        }
      }, 1000); // 每秒检查一次
    };

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshFunction, interval, isUserActive]);

  // 手动刷新函数
  const manualRefresh = () => {
    refreshFunction();
    lastRefreshRef.current = Date.now();
  };

  return {
    isUserActive,
    manualRefresh
  };
};