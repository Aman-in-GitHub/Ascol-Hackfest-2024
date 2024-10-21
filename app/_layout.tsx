import 'expo-dev-client';
import '../styles/unistyles';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import toastConfig from '@/utils/toastConfig';
import zustandStorage from '@/storage/storage';

const contactNumbers =
  // @ts-expect-error REASON ~ JSON.parse is not typed
  JSON.parse(zustandStorage.getItem('contactNumbers')) || [];

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)'
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    BodyTextFont: require('@fonts/Roboto-Regular.ttf'),
    BoldBodyTextFont: require('@fonts/Roboto-Bold.ttf'),
    HeadingFont: require('@fonts/Fredoka-Bold.ttf')
  });

  const router = useRouter();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // useEffect(() => {
  //   if (loaded && contactNumbers.length === 0) {
  //     router.replace('/Intro');
  //   }
  // }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      <Toast
        position="top"
        topOffset={90}
        visibilityTime={4000}
        config={toastConfig}
      />
    </GestureHandlerRootView>
  );
}
