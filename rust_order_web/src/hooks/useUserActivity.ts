import { useState, useEffect, useRef } from 'react';

export const useUserActivity = (inactivityDelay: number = 5000) => {
  const [isUserActive, setIsUserActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

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

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    resetActivityTimer();

    return () => {
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

export const useSmartRefresh = (
  refreshFunction: () => void | Promise<void>,
  interval: number = 30000,
  inactivityDelay: number = 5000
) => {
  const isUserActive = useUserActivity(inactivityDelay);
  const intervalRef = useRef<number | null>(null);
  const lastRefreshRef = useRef<number>(Date.now());

  useEffect(() => {
    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        if (!isUserActive) {
          const now = Date.now();
          if (now - lastRefreshRef.current >= interval) {
            refreshFunction();
            lastRefreshRef.current = now;
          }
        }
      }, 1000);
    };

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshFunction, interval, isUserActive]);

  const manualRefresh = () => {
    refreshFunction();
    lastRefreshRef.current = Date.now();
  };

  return {
    isUserActive,
    manualRefresh
  };
};