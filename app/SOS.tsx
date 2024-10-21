import { Pressable, ToastAndroid, Vibration, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Text from '@/components/Text';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { OtpInput } from 'react-native-otp-entry';
import Toast from 'react-native-toast-message';
import zustandStorage from '@/storage/storage';
import * as Location from 'expo-location';
import { NativeModules } from 'react-native';
import formatNumber from '@/utils/formatNumber';
import useSOSTimerStore from '@/storage/useSOSTimer';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
const { SmsModule, MyCallModule } = NativeModules;

const loudSOSEvents = [
  'A loud siren is played to ask for help',
  'Your contacts receive periodic updates of your location until help arrives or the SOS is cancelled.',
  'Your phone’s camera or microphone is activated to record audio or video for evidence.',
  'An SOS notification is sent to people near you to ask for help.',
  'Local authorities near you are alerted to your location.'
];

const silentSOSEvents = [
  'An option to call the authorities is provided in case of emergency.',
  'Your contacts receive periodic updates of your location until the SOS is cancelled.',
  'Your phone’s camera or microphone is activated to record audio or video for evidence.'
];

function SOS() {
  const { styles, theme } = useStyles(stylesheet);
  const [otpValue, setOtpValue] = useState('');
  const userOTP = zustandStorage.getItem('userOTP') || '0227';
  const [sosSound, setSosSound] = useState<any>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const device = useCameraDevice('back');
  const [location, setLocation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const timeToSOS = useSOSTimerStore((state) => state.timeToSOS);
  const decrementTimeToSOS = useSOSTimerStore(
    (state) => state.decrementTimeToSOS
  );
  const setTimeToSOS = useSOSTimerStore((state) => state.setTimeToSOS);

  const camera = useRef<Camera>(null);

  // const contactNumbers =
  //   // @ts-expect-error REASON ~ JSON.parse is not typed
  //   JSON.parse(zustandStorage.getItem('contactNumbers')) || [];

  const contactNumbers = ['9868000000'];

  useEffect(() => {
    let watchId: any;

    const setupLocationTracking = async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync();

      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission denied',
          text2: 'Enable permission to access your location'
        });

        setErrorMsg('Permission to access location was denied');
        return;
      }

      watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 5
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
          setLocation(googleMapsUrl);
        }
      );
    };

    setupLocationTracking();

    return () => {
      if (watchId) {
        watchId.remove();
      }

      setIsSOSActive(false);

      sosSound && sosSound.unloadAsync();
    };
  }, []);

  useEffect(() => {
    let timerId: any;
    let smsIntervalId: any;

    if (timeToSOS > 0) {
      timerId = setInterval(() => {
        Vibration.vibrate(500);

        decrementTimeToSOS();
      }, 1000);
    } else {
      if (id === 'loud') {
        playSosSound();
      }

      setIsSOSActive(true);

      setTimeout(() => {
        MyCallModule.makePhoneCall('9868000000');
      }, 10000);

      smsIntervalId = setInterval(() => {
        handleSMS(
          // contactNumbers.primaryContact,
          contactNumbers[0],
          `HELP SOS\nI am in very big trouble. Please call me as soon as possible.\nSend help immediately. My new location is ${text}`
        );

        Toast.show({
          type: 'success',
          text1: 'Contacts re alerted',
          text2: 'Your location has been sent to your primary contact'
        });
      }, 600000);

      startRecording();
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
      if (smsIntervalId) {
        clearInterval(smsIntervalId);
      }
    };
  }, [timeToSOS]);

  async function handleSMS(phoneNumber: string, message: string) {
    try {
      Toast.hide();

      const result = await SmsModule.sendSms(phoneNumber, message);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(result);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'SMS failed',
        text2: 'Call someone to help you immediately'
      });

      console.log(error);
    }
  }

  let text = 'Fetching your current location';

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = location;
  }

  async function startRecording() {
    if (camera.current === null) return;

    console.log('SETTING UP SMS');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    contactNumbers.forEach((number: string) => {
      if (number.length === 0) return;

      handleSMS(
        number,
        `HELP SOS\nI am in trouble. Please call me as soon as possible.\nSend help immediately. My current location: ${text}`
      );
    });

    Toast.show({
      type: 'success',
      text1: 'Contacts alerted',
      text2: 'Your location has been sent to your contacts'
    });

    camera.current.startRecording({
      onRecordingFinished: (video) => {
        const path = video.path;

        handleVideo(path);
      },
      onRecordingError: (error) => console.error(error)
    });
  }

  function stopRecording() {
    if (camera.current) {
      camera.current.stopRecording();
    }
  }

  async function playSosSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/sos.mp3'),
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

    setSosSound(sound);

    await sound.playAsync();
  }

  useEffect(() => {
    return sosSound
      ? () => {
          sosSound.unloadAsync();
        }
      : undefined;
  }, [sosSound]);

  async function handleVideo(path: string) {
    try {
      const savingVideo = await CameraRoll.save(`file://${path}`, {
        type: 'video'
      });

      ToastAndroid.show('Video saved to camera roll', ToastAndroid.BOTTOM);
    } catch (error) {
      console.log(error);
    }
  }

  const router = useRouter();

  async function verifyOtp() {
    Toast.hide();

    await new Promise((resolve) => setTimeout(resolve, 100));

    const otp = otpValue.trim();

    if (otp.length !== 4 || otp !== userOTP) {
      Vibration.vibrate(100);

      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Try Again'
      });

      setOtpValue('');

      return;
    }

    Vibration.vibrate(500);

    Toast.show({
      type: 'success',
      text1: 'OTP Verified',
      text2: 'SOS has been cancelled'
    });

    setTimeToSOS(10);
    setOtpValue('');

    if (isSOSActive) {
      contactNumbers.forEach((number: string) => {
        if (number.length === 0) return;

        handleSMS(
          number,
          `I AM SAFE\nI am safe now so you don't have to worry. I will call you as soon as I have some time.`
        );
      });

      Toast.show({
        type: 'success',
        text1: 'Contacts alerted',
        text2: 'Your status has been sent to your contacts'
      });
    }

    if (isSOSActive) {
      stopRecording();
    }

    router.replace('/');
  }

  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          // @ts-expect-error REASON ~ IDK
          title: `${id?.charAt(0).toUpperCase() + id?.slice(1)} SOS`,
          statusBarStyle: 'light',
          headerStyle: {
            backgroundColor: theme.colors.primary
          },
          headerTitleStyle: {
            color: theme.colors.whiteColor,
            fontFamily: 'HeadingFont',
            fontSize: theme.fontSize.xl
          },
          headerTitleAlign: 'center'
        }}
      />
      <View style={styles.container}>
        <View>
          <Text isBold={true} style={styles.title}>
            {timeToSOS > 0 ? 'Activating' : 'Activated'} {id} SOS
          </Text>
          <View style={styles.timerView}>
            <Text isBold={true} style={styles.timer}>
              {formatNumber(timeToSOS)}
            </Text>
          </View>

          <Camera
            /* @ts-expect-error : REASON ~ VISION is not typed */
            device={device}
            isActive={true}
            video={true}
            audio={true}
            /* @ts-expect-error : REASON ~ VISION is not typed */
            lowLightBoost={device.supportsLowLightBoost && true}
            enableLocation={true}
            ref={camera}
          />

          <View style={styles.otpView}>
            <OtpInput
              numberOfDigits={4}
              onTextChange={setOtpValue}
              focusColor={theme.colors.primary}
              secureTextEntry={true}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.pinCodeContainer
              }}
              autoFocus={false}
            />

            <Pressable style={styles.cancelButton} onPress={verifyOtp}>
              <Text
                isWhite={true}
                isBold={true}
                style={styles.cancelButtonText}
              >
                I am Safe, Cancel SOS
              </Text>
            </Pressable>
          </View>

          <Text
            isBold={true}
            style={{
              textAlign: 'center',
              marginBottom: 8
            }}
          >
            When you feel safe, cancel the SOS by entering your OTP
          </Text>

          <Text
            isBold={true}
            style={{
              marginBottom: 5
            }}
          >
            ~ What happens when the timer runs out?
          </Text>

          {id === 'loud'
            ? loudSOSEvents.map((event, index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: theme.fontSize.sm
                  }}
                >
                  - {event}
                </Text>
              ))
            : silentSOSEvents.map((event, index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: theme.fontSize.sm
                  }}
                >
                  - {event}
                </Text>
              ))}
        </View>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8
  },
  title: {
    fontSize: theme.fontSize.xl,
    textAlign: 'center',
    marginVertical: 5,
    color: theme.colors.primary
  },
  timerView: {
    width: 200,
    height: 200,
    borderRadius: theme.borderRadius.rounded,
    borderWidth: 8,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    marginVertical: 10
  },
  timer: {
    fontSize: 100,
    fontFamily: 'HeadingFont',
    color: theme.colors.primary
  },
  cancelButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.default,
    padding: 15,
    alignItems: 'center'
  },
  cancelButtonText: {
    fontSize: theme.fontSize.lg
  },
  otpView: {
    flexDirection: 'column',
    gap: 15,
    marginVertical: 10
  },
  otpContainer: {
    width: '100%',
    flexDirection: 'row'
  },
  pinCodeContainer: {
    width: 60,
    borderRadius: theme.borderRadius.default,
    borderColor: theme.colors.primary
  }
}));

export default SOS;
