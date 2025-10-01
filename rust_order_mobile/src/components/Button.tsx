import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { ButtonProps } from '../types';

const sizeStyles = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
};

const variantStyles = {
  primary: {
    backgroundColor: '#1DA1F2',
    borderColor: '#1DA1F2',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: '#1DA1F2',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#E1E8ED',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
};

const textStyles = {
  primary: { color: '#FFFFFF' },
  secondary: { color: '#1DA1F2' },
  outline: { color: '#14171A' },
  ghost: { color: '#1DA1F2' },
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  color = '#1DA1F2',
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 16;
        baseStyle.minHeight = 36;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 32;
        baseStyle.minHeight = 56;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 24;
        baseStyle.minHeight = 48;
    }

    // Variant styles
    switch (variant) {
      case 'outlined':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = disabled ? '#E0E0E0' : color;
        break;
      case 'text':
        baseStyle.backgroundColor = 'transparent';
        break;
      default: // filled
        baseStyle.backgroundColor = disabled ? '#E0E0E0' : color;
        baseStyle.elevation = disabled ? 0 : 2;
        baseStyle.shadowColor = '#000';
        baseStyle.shadowOffset = { width: 0, height: 2 };
        baseStyle.shadowOpacity = disabled ? 0 : 0.1;
        baseStyle.shadowRadius = disabled ? 0 : 4;
    }

    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Size text styles
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14;
        break;
      case 'large':
        baseTextStyle.fontSize = 18;
        break;
      default: // medium
        baseTextStyle.fontSize = 16;
    }

    // Variant text styles
    switch (variant) {
      case 'outlined':
        baseTextStyle.color = disabled ? '#9E9E9E' : color;
        break;
      case 'text':
        baseTextStyle.color = disabled ? '#9E9E9E' : color;
        break;
      default: // filled
        baseTextStyle.color = disabled ? '#9E9E9E' : '#FFFFFF';
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'filled' ? '#FFFFFF' : color}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;