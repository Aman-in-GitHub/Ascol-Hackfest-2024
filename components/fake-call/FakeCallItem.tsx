import React, { useEffect, useCallback } from 'react';
import { FakeProfileType } from '@/app/(tabs)/fake-call';
import Text from '@components/Text';
import { Pressable, View, Vibration } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import PhoneFill from '@/assets/icons/PhoneFill.svg';
import Plus from '@/assets/icons/Plus.svg';
import Delete from '@/assets/icons/Delete.svg';
import Toast from 'react-native-toast-message';
import zustandStorage from '@/storage/storage';
import useIsCallSetStore from '@/storage/useIsCallSetStore';
import formatNumber from '@/utils/formatNumber';
import { useRouter } from 'expo-router';

function FakeCallItem({
  item,
  forceUpdate
}: {
  item: FakeProfileType;
  forceUpdate: any;
}) {
  const { styles, theme } = useStyles(stylesheet);
  const waitDuration = Number(zustandStorage.getItem('waitDuration') || 5);

  const isCallSet = useIsCallSetStore((state) => state.isCallSet);
  const setIsCallSet = useIsCallSetStore((state) => state.setIsCallSet);
  const callerId = useIsCallSetStore((state) => state.callerId);
  const setCallerId = useIsCallSetStore((state) => state.setCallerId);
  const timeToCall = useIsCallSetStore((state) => state.timeToCall);
  const setTimeToCall = useIsCallSetStore((state) => state.setTimeToCall);
  const decrementTimeToCall = useIsCallSetStore(
    (state) => state.decrementTimeToCall
  );

  const isThisItemCalling = isCallSet && callerId === item.id;

  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isThisItemCalling && timeToCall > 0) {
      timer = setInterval(() => {
        decrementTimeToCall();
      }, 1000);
    } else if (isThisItemCalling && timeToCall === 0) {
      router.replace('/FakeCallPage');

      setIsCallSet(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [
    isThisItemCalling,
    timeToCall,
    decrementTimeToCall,
    setIsCallSet,
    setCallerId,
    item.name
  ]);

  async function handleCall() {
    if (isCallSet) return;

    Vibration.vibrate(50);

    Toast.hide();

    setCallerId(item.id);
    setIsCallSet(true);
    setTimeToCall(waitDuration);

    await new Promise((resolve) => setTimeout(resolve, 100));

    Toast.show({
      type: 'success',
      text1: `Call scheduled`,
      text2: `You will receive a call from ${item.name} in ${waitDuration} seconds`
    });
  }

  async function cancelCall() {
    if (!isThisItemCalling) return;

    Vibration.vibrate(50);

    Toast.hide();

    setIsCallSet(false);
    setCallerId('');
    setTimeToCall(0);

    await new Promise((resolve) => setTimeout(resolve, 100));

    Toast.show({
      type: 'error',
      text1: 'Call cancelled',
      text2: `Your call with ${item.name} has been cancelled`
    });
  }

  async function deleteContact() {
    if (isCallSet) return;

    Toast.hide();

    await new Promise((resolve) => setTimeout(resolve, 100));

    const fakeContacts =
      // @ts-expect-error REASON ~ MMKV is not typed
      JSON.parse(zustandStorage.getItem('fakeCallContacts')) || [];

    zustandStorage.setItem(
      'fakeCallContacts',
      JSON.stringify(
        fakeContacts.filter(
          (contact: FakeProfileType) => contact.id !== item.id
        )
      )
    );

    forceUpdate({});

    Toast.show({
      type: 'error',
      text1: 'Contact deleted',
      text2: `${item.name} has been deleted from your contacts`
    });
  }

  return (
    <View style={styles.profileContainer}>
      <View>
        <Text isBold={true} isWhite={true} style={styles.nameText}>
          {item.name}
        </Text>
        <Text isWhite={true} style={styles.numberText}>
          {item.phone}
        </Text>
        {isThisItemCalling && (
          <Text isWhite={true} style={styles.timerText}>
            Incoming call in: {formatNumber(timeToCall)}s
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {!isThisItemCalling ? (
          <Pressable
            style={[styles.callButtonStyle, isCallSet && styles.disabledButton]}
            android_ripple={{
              color: theme.colors.androidRipple,
              borderless: true
            }}
            onPress={handleCall}
            disabled={isCallSet}
          >
            <PhoneFill fill={theme.colors.primary} width={32} height={32} />
          </Pressable>
        ) : (
          <Pressable
            style={styles.callButtonStyle}
            android_ripple={{
              color: theme.colors.androidRipple,
              borderless: true
            }}
            onPress={cancelCall}
          >
            <Plus
              fill={theme.colors.primary}
              width={32}
              height={32}
              style={{
                transform: [{ rotate: '45deg' }]
              }}
            />
          </Pressable>
        )}

        <Pressable
          style={[styles.callButtonStyle, isCallSet && styles.disabledButton]}
          android_ripple={{
            color: theme.colors.androidRipple,
            borderless: true
          }}
          onPress={deleteContact}
          disabled={isCallSet}
        >
          <Delete fill={theme.colors.primary} width={32} height={32} />
        </Pressable>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  profileContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.default,
    justifyContent: 'space-between'
  },
  nameText: {
    fontSize: theme.fontSize.original
  },
  numberText: {
    fontSize: theme.fontSize.sm
  },
  timerText: {
    fontSize: theme.fontSize.sm,
    marginTop: 2
  },
  callButtonStyle: {
    backgroundColor: theme.colors.whiteColor,
    borderRadius: theme.borderRadius.rounded,
    padding: 8,
    overflow: 'hidden'
  },
  disabledButton: {
    opacity: 0.5
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  }
}));

export default FakeCallItem;
