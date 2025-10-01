import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface BadgeProps {
  count: number;
  maxCount?: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showZero?: boolean;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  count,
  maxCount = 99,
  size = 'medium',
  color = '#1DA1F2',
  textColor = '#FFFFFF',
  style,
  textStyle,
  showZero = false,
  dot = false,
}) => {
  if (!showZero && count === 0) {
    return null;
  }

  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: color,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: -6,
      right: -6,
      zIndex: 1,
    };

    if (dot) {
      switch (size) {
        case 'small':
          baseStyle.width = 6;
          baseStyle.height = 6;
          break;
        case 'large':
          baseStyle.width = 12;
          baseStyle.height = 12;
          break;
        default: // medium
          baseStyle.width = 8;
          baseStyle.height = 8;
      }
    } else {
      switch (size) {
        case 'small':
          baseStyle.minWidth = 16;
          baseStyle.height = 16;
          baseStyle.paddingHorizontal = 4;
          break;
        case 'large':
          baseStyle.minWidth = 24;
          baseStyle.height = 24;
          baseStyle.paddingHorizontal = 6;
          break;
        default: // medium
          baseStyle.minWidth = 20;
          baseStyle.height = 20;
          baseStyle.paddingHorizontal = 5;
      }
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: textColor,
      fontWeight: 'bold',
      textAlign: 'center',
    };

    switch (size) {
      case 'small':
        baseStyle.fontSize = 10;
        break;
      case 'large':
        baseStyle.fontSize = 14;
        break;
      default: // medium
        baseStyle.fontSize = 12;
    }

    return baseStyle;
  };

  const getDisplayText = (): string => {
    if (count > maxCount) {
      return `${maxCount}+`;
    }
    return count.toString();
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      {!dot && (
        <Text style={[getTextStyle(), textStyle]}>
          {getDisplayText()}
        </Text>
      )}
    </View>
  );
};

export default Badge;