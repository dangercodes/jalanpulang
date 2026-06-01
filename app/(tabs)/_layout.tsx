import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BookOpen, Clock, Heart, Home, Settings } from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const iconColor = colorScheme === 'dark' ? '#9CA3AF' : '#c8b6a6'; // Light grayish-brown for inactive
  const activeIconColor = '#926247'; // The new brown primary color

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeIconColor,
        tabBarInactiveTintColor: iconColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#2d2420' : '#ffffff',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Home color={focused ? activeIconColor : iconColor} size={24} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: 'Quran',
          tabBarIcon: ({ color, focused }) => <BookOpen color={focused ? activeIconColor : iconColor} size={24} />,
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: 'Prayer',
          tabBarIcon: ({ color, focused }) => <Clock color={focused ? activeIconColor : iconColor} size={24} />,
        }}
      />
      <Tabs.Screen
        name="doa"
        options={{
          title: 'Doa',
          tabBarIcon: ({ color, focused }) => <Heart color={focused ? activeIconColor : iconColor} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <Settings color={focused ? activeIconColor : iconColor} size={24} />,
        }}
      />
    </Tabs>
  );
}
