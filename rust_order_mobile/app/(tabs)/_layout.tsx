import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1DA1F2', // Twitter Blue
        tabBarInactiveTintColor: '#757575', // Material Design Grey
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: '点单',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'restaurant' : 'restaurant-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pickup"
        options={{
          title: '取餐',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'bag-check' : 'bag-check-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
