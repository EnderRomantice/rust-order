import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  variant = 'outlined',
  style,
  inputStyle,
  labelStyle,
  required = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginVertical: 8,
    };

    return baseStyle;
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      minHeight: 56,
      justifyContent: 'center',
    };

    if (variant === 'outlined') {
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = error ? '#F91880' : isFocused ? '#1DA1F2' : '#E0E0E0';
      baseStyle.backgroundColor = '#FFFFFF';
      baseStyle.paddingHorizontal = 16;
    } else {
      baseStyle.backgroundColor = error ? '#FFEBEE' : isFocused ? '#E3F2FD' : '#F5F5F5';
      baseStyle.paddingHorizontal = 16;
      baseStyle.borderBottomWidth = 2;
      baseStyle.borderBottomColor = error ? '#F91880' : isFocused ? '#1DA1F2' : '#E0E0E0';
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 16,
      color: '#212121',
      paddingVertical: 0,
    };

    return baseStyle;
  };

  const getLabelStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 12,
      color: error ? '#F91880' : isFocused ? '#1DA1F2' : '#757575',
      marginBottom: 4,
      fontWeight: '500',
    };

    return baseStyle;
  };

  const getHelperTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 12,
      color: error ? '#F91880' : '#757575',
      marginTop: 4,
      marginLeft: variant === 'outlined' ? 16 : 0,
    };

    return baseStyle;
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
          {required && <Text style={{ color: '#F91880' }}> *</Text>}
        </Text>
      )}
      <View style={getInputContainerStyle()}>
        <RNTextInput
          style={[getInputStyle(), inputStyle]}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor="#9E9E9E"
          {...props}
        />
      </View>
      {(error || helperText) && (
        <Text style={getHelperTextStyle()}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

export default TextInput;