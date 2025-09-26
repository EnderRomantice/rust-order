import { Chip } from "@heroui/react";
import type { ActivityIndicatorProps } from '../types';

const ActivityIndicator = ({ isUserActive, className = "" }: ActivityIndicatorProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Chip
        size="sm"
        variant="flat"
        color={isUserActive ? "warning" : "success"}
        startContent={
          <div className={`w-2 h-2 rounded-full ${
            isUserActive ? "bg-orange-500" : "bg-green-500"
          }`} />
        }
      >
        {isUserActive ? "操作中" : "自动刷新"}
      </Chip>
      <span className="text-xs text-gray-500">
        {isUserActive 
          ? "检测到用户操作，已暂停自动刷新" 
          : "用户空闲，自动刷新已启用"
        }
      </span>
    </div>
  );
};

export default ActivityIndicator;