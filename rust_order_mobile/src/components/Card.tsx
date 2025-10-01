import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: number;
  padding?: number;
  margin?: number;
  borderRadius?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 2,
  padding = 16,
  margin = 8,
  borderRadius = 12,
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius,
    padding,
    margin,
    elevation,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation * 2,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

export default Card;