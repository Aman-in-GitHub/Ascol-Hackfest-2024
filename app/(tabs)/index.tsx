import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Pressable, Vibration, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Text from '@/components/Text';
import { Stack, useRouter } from 'expo-router';
import RNShake from 'react-native-shake';

type TapHandler = () => void;

function Index() {
  const { styles, theme } = useStyles(stylesheet);
  const [tapCount, setTapCount] = useState<number>(0);
  const tapTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleSingleTap: TapHandler = useCallback(() => {
    console.log('Single tap detected - Sending silent SOS');

    router.replace({
      pathname: '/SOS',
      params: { id: 'silent' }
    });
  }, [router]);

  const handleTripleTap: TapHandler = useCallback(() => {
    console.log('Triple tap detected - Sending loud SOS');

    router.replace({
      pathname: '/SOS',
      params: { id: 'loud' }
    });
  }, [router]);

  const handleShake = useCallback(() => {
    console.log('Shake detected - Navigating to SOS page');

    Vibration.vibrate(1000);

    router.replace({
      pathname: '/SOS',
      params: { id: 'loud' }
    });
  }, [router]);

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      handleShake();
    });

    return () => {
      subscription.remove();
    };
  }, [handleShake]);

  const handleSOSPress = useCallback(() => {
    Vibration.vibrate(100);
    setTapCount((prevCount) => prevCount + 1);

    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }

    tapTimer.current = setTimeout(() => {
      if (tapCount + 1 === 1) {
        handleSingleTap();
      } else if (tapCount + 1 >= 3) {
        handleTripleTap();
      }
      setTapCount(0);
    }, 300);
  }, [tapCount, handleSingleTap, handleTripleTap]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Save Our Soul',
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
        <StatusBar style="light" translucent={true} hidden={false} />
        <View style={styles.textWrapper}>
          <Text isBold={true} style={styles.titleText}>
            Are you in an emergency?
          </Text>
          <View>
            <Text style={styles.subTitleText}>
              Press{' '}
              <Text
                isBold={true}
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: 'underline'
                }}
              >
                once
              </Text>{' '}
              to send a silent SOS
            </Text>
            <Text style={styles.subTitleText}>
              Press{' '}
              <Text
                isBold={true}
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: 'underline'
                }}
              >
                three times
              </Text>{' '}
              to send a loud SOS
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.sosWrapper1}
          onPress={handleSOSPress}
          android_ripple={{
            color: theme.colors.danger50,
            borderless: true
          }}
        >
          <View style={styles.sosWrapper2}>
            <View style={styles.sosWrapper3}>
              <View style={styles.sosWrapper4}>
                <Text style={styles.sosText}>SOS</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  textWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: -80,
    marginBottom: 50
  },
  titleText: {
    color: theme.colors.primary,
    fontSize: 24,
    textAlign: 'center'
  },
  subTitleText: {
    fontSize: theme.fontSize.sm,
    textAlign: 'center'
  },
  sosWrapper1: {
    width: 340,
    height: 340,
    backgroundColor: theme.colors.danger50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.rounded
  },
  sosWrapper2: {
    width: 290,
    height: 290,
    backgroundColor: theme.colors.danger70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.rounded
  },
  sosWrapper3: {
    width: 240,
    height: 240,
    backgroundColor: theme.colors.danger90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.rounded
  },
  sosWrapper4: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 180,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.rounded
  },
  sosText: {
    color: theme.colors.whiteColor,
    fontFamily: 'HeadingFont',
    fontSize: 50
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.default,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 50
  }
}));

export default Index;
