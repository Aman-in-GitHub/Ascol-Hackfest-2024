import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Text from '@/components/Text';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import PhoneOutline from '@/assets/icons/PhoneOutline.svg';
import MessageBox from '@/assets/icons/ChatBox.svg';
import Mute from '@/assets/icons/Mute.svg';
import Speaker from '@/assets/icons/Speaker.svg';
import Keyboard from '@/assets/icons/Keyboard.svg';
import AddCall from '@/assets/icons/AddCall.svg';
import Pause from '@/assets/icons/Pause.svg';
import ChatBubble from '@/assets/icons/ChatBubble.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Vibration, View } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import useIsCallSetStore from '@/storage/useIsCallSetStore';
import zustandStorage from '@/storage/storage';
import { FakeProfileType } from './(tabs)/fake-call';

function FakeCallPage() {
  const { styles, theme } = useStyles(stylesheet);
  const router = useRouter();
  const [sound, setSound] = useState<any>(null);
  const [callSound, setCallSound] = useState<any>(null);
  const [isCallAccepted, setIsCallAccepted] = useState(false);

  const [seconds, setSeconds] = useState(0);

  const callerId = useIsCallSetStore((state) => state.callerId);
  const setCallerId = useIsCallSetStore((state) => state.setCallerId);

  const callDuration = Number(zustandStorage.getItem('callDuration')) || 30;

  const fakeContacts = JSON.parse(
    // @ts-expect-error REASON ~ MMKV is not typed
    zustandStorage.getItem('fakeCallContacts') || '[]'
  );

  const currentUser: FakeProfileType = useMemo(
    () =>
      fakeContacts.find((contact: FakeProfileType) => contact.id === callerId),
    [callerId, fakeContacts]
  );

  useEffect(() => {
    let timer = undefined;

    if (isCallAccepted) {
      playCallRecording();

      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isCallAccepted && seconds !== 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isCallAccepted]);

  useEffect(() => {
    if (seconds > callDuration) {
      handleCallReject();
    }
  }, [seconds]);

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  }

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, {
        duration: 1000,
        easing: Easing.ease
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  async function playSound() {
    if (isCallAccepted) return;

    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/ringtone.mp3'),
      {
        isLooping: true
      }
    );

    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false
    });

    setSound(sound);

    await sound.playAsync();
  }

  async function pauseSound() {
    if (sound) {
      const status = await sound.getStatusAsync();

      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
        }
      }
    } else {
      console.log('Sound object does not exist');
    }
  }

  async function playCallRecording() {
    const { sound } = await Audio.Sound.createAsync({
      uri: currentUser.audio.uri
    });

    await sound.setVolumeAsync(0.3);

    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false
    });

    setCallSound(sound);

    await sound.setIsLoopingAsync(true);

    await sound.playAsync();
  }

  async function pauseCallRecording() {
    if (callSound) {
      const status = await callSound.getStatusAsync();

      if (status.isLoaded) {
        if (status.isPlaying) {
          await callSound.pauseAsync();
        }
      }
    } else {
      console.log('Sound object does not exist');
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    return callSound
      ? () => {
          callSound.unloadAsync();
        }
      : undefined;
  }, [callSound]);

  function handleCallReject() {
    Vibration.vibrate(100);
    pauseCallRecording();

    setCallerId('');
    router.replace('/(tabs)/fake-call');
  }

  function handleCallAccept() {
    pauseSound();

    Vibration.cancel();
    setIsCallAccepted(true);
  }

  useEffect(() => {
    Vibration.vibrate([1000, 2000], true);

    playSound();

    return () => {
      Vibration.cancel();
      setCallerId('');
    };
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" translucent={true} hidden={false} />

        <LinearGradient
          colors={[
            isCallAccepted ? theme.colors.success : theme.colors.trueCaller,
            '#000'
          ]}
          style={styles.background}
        />

        <Image
          style={styles.image}
          source={require('../assets/images/truecaller.png')}
          contentFit="contain"
          transition={500}
        />

        <View style={styles.topHalfWrapper}>
          <Text isWhite={true} style={styles.incomingText}>
            {isCallAccepted ? formatTime(seconds) : 'Incoming Call'}
          </Text>
          <Text isWhite={true} style={styles.phoneNumber}>
            {currentUser.phone}
          </Text>
        </View>

        <View>
          <View
            style={[
              styles.avatar,
              {
                marginTop: isCallAccepted ? 30 : 70
              }
            ]}
          >
            <Text
              style={{
                fontSize: 65,
                color: isCallAccepted
                  ? theme.colors.success
                  : theme.colors.trueCaller
              }}
            >
              {currentUser.name[0]?.toUpperCase()}
            </Text>
          </View>
          <Text isWhite={true} style={styles.nameText}>
            {currentUser.name}
          </Text>
        </View>

        {isCallAccepted && (
          <View
            style={{
              flexDirection: 'column',
              gap: 40,
              paddingHorizontal: 30,
              marginTop: 30
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10
              }}
            >
              <Pressable style={styles.outlineButton}>
                <Mute
                  fill={theme.colors.mutedWhiteColor}
                  width={30}
                  height={30}
                />
              </Pressable>
              <Pressable style={styles.outlineButton}>
                <Keyboard
                  fill={theme.colors.mutedWhiteColor}
                  width={30}
                  height={30}
                />
              </Pressable>
              <Pressable style={styles.outlineButton}>
                <Speaker
                  fill={theme.colors.mutedWhiteColor}
                  width={30}
                  height={30}
                />
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10
              }}
            >
              <Pressable style={styles.outlineButton}>
                <AddCall
                  fill={theme.colors.mutedWhiteColor}
                  width={30}
                  height={30}
                />
              </Pressable>
              <Pressable style={styles.outlineButton}>
                <Pause
                  fill={theme.colors.mutedWhiteColor}
                  width={30}
                  height={30}
                />
              </Pressable>
              <Pressable style={styles.outlineButton}>
                <ChatBubble
                  fill={theme.colors.mutedWhiteColor}
                  width={30}
                  height={30}
                />
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.incomingActionWrapper}>
          {isCallAccepted && (
            <View
              style={[
                styles.redButton,
                {
                  opacity: 0
                }
              ]}
            />
          )}

          {!isCallAccepted && (
            <Pressable style={styles.redButton} onPress={handleCallReject}>
              <PhoneOutline
                fill={theme.colors.mutedWhiteColor}
                width={40}
                height={40}
                style={{
                  transform: [{ rotate: '135deg' }]
                }}
              />
            </Pressable>
          )}

          {isCallAccepted && (
            <Pressable
              style={[
                styles.greenButton,
                {
                  backgroundColor: theme.colors.danger
                }
              ]}
              onPress={handleCallReject}
            >
              <PhoneOutline
                fill={theme.colors.mutedWhiteColor}
                width={45}
                height={45}
                style={{
                  transform: [{ rotate: '135deg' }]
                }}
              />
            </Pressable>
          )}

          {!isCallAccepted && (
            <Animated.View style={animatedStyle}>
              <Pressable style={styles.greenButton} onPress={handleCallAccept}>
                <PhoneOutline
                  fill={theme.colors.mutedWhiteColor}
                  width={45}
                  height={45}
                />
              </Pressable>
            </Animated.View>
          )}

          <Pressable style={styles.outlineButton}>
            <MessageBox
              fill={theme.colors.mutedWhiteColor}
              width={40}
              height={40}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 20
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '110%'
  },
  avatar: {
    width: 140,
    height: 140,
    backgroundColor: theme.colors.mutedWhiteColor,
    borderRadius: theme.borderRadius.rounded,
    marginHorizontal: 'auto',
    marginTop: 70,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    opacity: 0.9
  },
  nameText: {
    fontSize: 30,
    marginHorizontal: 'auto',
    marginTop: 15
  },
  image: {
    height: 20,
    width: 150,
    marginHorizontal: 'auto'
  },
  topHalfWrapper: {
    alignItems: 'center',
    marginTop: 35
  },
  incomingText: {
    fontSize: theme.fontSize.sm
  },
  phoneNumber: {
    fontSize: theme.fontSize.xl,
    marginTop: 2
  },
  incomingActionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 70,
    width: '100%',
    paddingHorizontal: 30
  },
  greenButton: {
    backgroundColor: theme.colors.success,
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.rounded,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10
  },
  redButton: {
    backgroundColor: theme.colors.danger,
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.rounded,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10
  },
  outlineButton: {
    backgroundColor: theme.colors.transparent,
    borderWidth: 2,
    borderColor: theme.colors.mutedWhiteColor,
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.rounded,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10
  }
}));

export default FakeCallPage;
