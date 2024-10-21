import { View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Text from '@/components/Text';

function NotFound() {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Oops!',
          statusBarStyle: 'light',
          headerStyle: {
            backgroundColor: theme.colors.primary
          },
          headerTintColor: theme.colors.whiteColor,
          headerTitleStyle: {
            color: theme.colors.whiteColor,
            fontFamily: 'HeadingFont',
            fontSize: theme.fontSize.xl
          }
        }}
      />
      <View style={styles.container}>
        <Text>404 Not Found</Text>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background
  }
}));

export default NotFound;
