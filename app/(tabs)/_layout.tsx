import React from 'react';
import { Tabs } from 'expo-router';
import { useStyles } from 'react-native-unistyles';
import AidOutline from '@/assets/icons/AidOutline.svg';
import AidFill from '@/assets/icons/AidFill.svg';
import PhoneOutline from '@/assets/icons/PhoneOutline.svg';
import PhoneFill from '@/assets/icons/PhoneFill.svg';
import TipsOutline from '@/assets/icons/TipsOutline.svg';
import TipsFill from '@/assets/icons/TipsFill.svg';

export default function TabLayout() {
  const { theme } = useStyles();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.activeTintColor,
        tabBarInactiveTintColor: theme.colors.inActiveTintColor,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          height: 60,
          borderColor: theme.colors.navBorderColor,
          elevation: 0
        },
        tabBarShowLabel: false,
        headerTitleStyle: {
          fontFamily: 'HeadingFont',
          color: theme.colors.whiteColor,
          fontSize: theme.fontSize.xl
        },
        headerStyle: {
          backgroundColor: theme.colors.primary
        },
        headerStatusBarHeight: 28
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'SOS',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <AidFill fill={color} width={36} height={36} />
            ) : (
              <AidOutline fill={color} width={36} height={36} />
            )
        }}
      />
      <Tabs.Screen
        name="fake-call"
        options={{
          title: 'Fake Call',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <PhoneFill fill={color} width={32} height={32} />
            ) : (
              <PhoneOutline fill={color} width={32} height={32} />
            )
        }}
      />

      <Tabs.Screen
        name="tips"
        options={{
          title: 'Tips & Tricks',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <TipsFill fill={color} width={32} height={32} />
            ) : (
              <TipsOutline fill={color} width={32} height={32} />
            )
        }}
      />
    </Tabs>
  );
}
