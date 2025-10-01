import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#1DA1F2',
  text,
  style,
  textStyle,
  overlay = false,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    };

    if (overlay) {
      baseStyle.position = 'absolute';
      baseStyle.top = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
      baseStyle.bottom = 0;
      baseStyle.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      baseStyle.zIndex = 1000;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      marginTop: 12,
      fontSize: 16,
      color: '#757575',
      textAlign: 'center',
    };

    return baseStyle;
  };

  return (
    <View style={[getContainerStyle(), style]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={[getTextStyle(), textStyle]}>
          {text}
        </Text>
      )}
    </View>
  );
};

export default LoadingSpinner;