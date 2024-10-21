import { FlatList, Pressable, View, TextInput } from 'react-native';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Toast from 'react-native-toast-message';
import FakeCallItem from '@/components/fake-call/FakeCallItem';
import Text from '@/components/Text';
import Plus from '@/assets/icons/Plus.svg';
import Minus from '@/assets/icons/Minus.svg';
import formatNumber from '@/utils/formatNumber';
import zustandStorage from '@/storage/storage';
import AddContactSheet from '@/components/fake-call/AddContact';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Asset } from 'expo-media-library';

export type FakeProfileType = {
  id: string;
  name: string;
  phone: string;
  audio: Asset;
};

function FakeCall() {
  const { styles, theme } = useStyles(stylesheet);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const [, forceUpdate] = useState({});
  const [editingField, setEditingField] = useState<'wait' | 'call' | null>(
    null
  );
  const [tempInputValue, setTempInputValue] = useState('');
  const waitInputRef = useRef<TextInput>(null);
  const callInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (editingField === 'wait') {
      waitInputRef.current?.focus();
      setTempInputValue(getWaitDuration().toString());
    } else if (editingField === 'call') {
      callInputRef.current?.focus();
      setTempInputValue(getCallDuration().toString());
    }
  }, [editingField]);

  const fakeContacts =
    // @ts-expect-error REASON ~ MMKV is not typed
    JSON.parse(zustandStorage.getItem('fakeCallContacts')) || [];

  function getWaitDuration(): number {
    return Number(zustandStorage.getItem('waitDuration')) || 5;
  }

  function getCallDuration(): number {
    return Number(zustandStorage.getItem('callDuration')) || 30;
  }

  function setWaitDuration(duration: number) {
    zustandStorage.setItem('waitDuration', duration.toString());
    forceUpdate({});
  }

  function setCallDuration(duration: number) {
    zustandStorage.setItem('callDuration', duration.toString());
    forceUpdate({});
  }

  async function handleDurationChange(
    type: 'wait' | 'call',
    action: '+' | '-'
  ) {
    const [getDuration, setDuration] =
      type === 'wait'
        ? [getWaitDuration, setWaitDuration]
        : [getCallDuration, setCallDuration];
    const minDuration = type === 'wait' ? 5 : 15;
    const currentDuration = getDuration();

    if (action === '-') {
      if (currentDuration <= minDuration) {
        Toast.hide();

        await new Promise((resolve) => setTimeout(resolve, 100));

        showErrorToast(
          `Cannot set ${type} duration`,
          `${
            type === 'wait' ? 'Wait' : 'Call'
          } duration should be at least ${minDuration} seconds`
        );
        return;
      }
      setDuration(currentDuration - 1);
    } else if (action === '+') {
      setDuration(currentDuration + 1);
    }
  }

  function handleInputChange(text: string) {
    setTempInputValue(text);
  }

  function showErrorToast(title: string, message: string) {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message
    });
  }

  function handleInputBlur(type: 'wait' | 'call') {
    const minDuration = type === 'wait' ? 5 : 15;
    const setDuration = type === 'wait' ? setWaitDuration : setCallDuration;

    let finalValue = parseInt(tempInputValue, 10);

    if (isNaN(finalValue) || finalValue < minDuration) {
      finalValue = minDuration;
      showErrorToast(
        'Invalid input',
        `${
          type === 'wait' ? 'Wait' : 'Call'
        } duration set to minimum of ${minDuration} seconds`
      );
    }

    setDuration(finalValue);
    setEditingField(null);
    setTempInputValue('');
  }

  const renderDurationControl = (type: 'wait' | 'call') => {
    const duration = type === 'wait' ? getWaitDuration() : getCallDuration();
    const inputRef = type === 'wait' ? waitInputRef : callInputRef;

    return (
      <View style={styles.durationRow}>
        <View style={{ flexBasis: '50%' }}>
          <Text isBold={true} style={styles.durationText}>
            {type === 'wait' ? 'Wait Duration' : 'Call Duration'}
          </Text>
          <Text style={styles.durationDesc}>
            {type === 'wait'
              ? `Call will start after ${duration} seconds`
              : `Call will last for ${duration} seconds`}
          </Text>
        </View>

        <View style={styles.durationControls}>
          <Pressable
            style={[
              styles.durationIconButton,
              editingField === type && styles.disabledButton
            ]}
            onPress={() => handleDurationChange(type, '-')}
            android_ripple={{
              color: theme.colors.androidRipple,
              borderless: true
            }}
            disabled={editingField === type}
          >
            <Minus fill={theme.colors.whiteColor} width={24} height={24} />
          </Pressable>
          <Pressable
            style={styles.counterContainer}
            onPress={() => setEditingField(type)}
          >
            {editingField === type ? (
              <TextInput
                ref={inputRef}
                style={styles.counterInput}
                value={tempInputValue}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                onBlur={() => handleInputBlur(type)}
                selectTextOnFocus
                selectionColor={theme.colors.primary}
              />
            ) : (
              <Text isBold={true} style={styles.counterText}>
                {formatNumber(duration)}
              </Text>
            )}
          </Pressable>
          <Pressable
            style={[
              styles.durationIconButton,
              editingField === type && styles.disabledButton
            ]}
            onPress={() => handleDurationChange(type, '+')}
            android_ripple={{
              color: theme.colors.androidRipple,
              borderless: true
            }}
            disabled={editingField === type}
          >
            <Plus fill={theme.colors.whiteColor} width={24} height={24} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlContainer}>
        {renderDurationControl('wait')}
        {renderDurationControl('call')}
      </View>

      <Text isBold={true} style={styles.sectionTitle}>
        Your Contacts
      </Text>

      <View style={styles.flatListWrapper}>
        <FlatList
          data={fakeContacts}
          renderItem={({ item }) => (
            <FakeCallItem item={item} forceUpdate={forceUpdate} />
          )}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text isBold={true} style={styles.emptyListText}>
              No Contacts Yet
            </Text>
          }
        />
      </View>

      <Pressable
        onPress={handlePresentModalPress}
        style={styles.addProfileButton}
      >
        <Plus fill={theme.colors.primary} width={24} height={24} />
        <Text style={styles.addProfileButtonText}>Add Contact</Text>
      </Pressable>

      <AddContactSheet
        bottomSheetModalRef={bottomSheetModalRef}
        forceUpdate={forceUpdate}
      />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8
  },
  flatListWrapper: {
    height: 400,
    marginBottom: 15
  },
  listContainer: {
    gap: 4
  },
  durationText: {
    fontSize: theme.fontSize.lg
  },
  durationDesc: {
    fontSize: theme.fontSize.xs
  },
  controlContainer: {
    paddingVertical: 15,
    gap: 15
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5
  },
  durationIconButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.rounded,
    overflow: 'hidden',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterContainer: {
    width: 80,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.rounded,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    overflow: 'hidden'
  },
  counterText: {
    fontFamily: 'HeadingFont',
    fontSize: theme.fontSize.lg
  },
  disabledButton: {
    opacity: 0.5
  },
  counterInput: {
    fontFamily: 'HeadingFont',
    fontSize: theme.fontSize.lg,
    textAlign: 'center',
    width: '100%',
    height: '100%'
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    marginBottom: 5
  },
  addProfileButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.rounded,
    padding: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary
  },
  addProfileButtonText: {
    fontSize: theme.fontSize.lg
  },
  emptyListText: {
    fontSize: theme.fontSize.lg,
    textAlign: 'center',
    color: theme.colors.primary,
    paddingVertical: '50%'
  }
}));

export default FakeCall;
