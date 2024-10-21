import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetBackdropProps
} from '@gorhom/bottom-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useFocusEffect } from 'expo-router';
import Text from '@components/Text';
import { Pressable, TextInput, View, FlatList, Modal } from 'react-native';
import Plus from '@/assets/icons/Plus.svg';
import * as MediaLibrary from 'expo-media-library';
import Toast from 'react-native-toast-message';
import zustandStorage from '@/storage/storage';
import generateRandomUUID from '@/utils/getUuid';

function AddContactSheet({ bottomSheetModalRef, forceUpdate }: any) {
  const snapPoints = useMemo(() => ['75%', '75%'], []);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [audioAsset, setAudioAsset] = useState<MediaLibrary.Asset | null>(null);
  const [audioList, setAudioList] = useState<MediaLibrary.Asset[]>([]);
  const [isAudioListVisible, setIsAudioListVisible] = useState(false);
  const { styles, theme } = useStyles(stylesheet);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setName('');
      setPhoneNumber('');
      setAudioAsset(null);
      setAudioList([]);
      setIsAudioListVisible(false);
    }
  }, []);

  async function handleSubmit() {
    Toast.hide();

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (name.trim() === '' || phoneNumber.trim() === '') {
      Toast.show({
        text1: 'Incomplete data',
        text2: 'All fields are required to add contact',
        type: 'error'
      });

      return;
    }

    if (!audioAsset) {
      Toast.show({
        text1: 'No audio file',
        text2: 'Audio file is required to add contact',
        type: 'error'
      });

      return;
    }

    if (audioAsset.duration < 15) {
      Toast.show({
        text1: 'Too short audio',
        text2: 'Audio file should be at least 15 seconds',
        type: 'error'
      });

      return;
    }

    const contact = {
      id: generateRandomUUID(),
      name: name,
      phone: phoneNumber,
      audio: audioAsset
    };

    setName('');
    setPhoneNumber('');
    setAudioAsset(null);
    setAudioList([]);

    const fakeContacts =
      // @ts-expect-error REASON ~ MMKV is not typed
      JSON.parse(zustandStorage.getItem('fakeCallContacts')) || [];

    zustandStorage.setItem(
      'fakeCallContacts',
      JSON.stringify([...fakeContacts, contact])
    );

    forceUpdate({});

    bottomSheetModalRef.current?.close();

    Toast.show({
      text1: 'Contact added',
      text2: `${contact.name} has been added to your contacts`,
      type: 'success'
    });
  }

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  useFocusEffect(
    useCallback(() => {
      return () => bottomSheetModalRef.current?.close();
    }, [])
  );

  const handleSelectAudio = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      Toast.show({
        text1: 'Permission denied',
        text2: 'Grant permission to use media library',
        type: 'error'
      });
      return;
    }

    let result = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 100
    });

    setAudioList(result.assets);
    setIsAudioListVisible(true);
  };

  const handleAudioSelection = (asset: any) => {
    setAudioAsset(asset);
    setIsAudioListVisible(false);
  };

  const renderAudioItem = ({ item }: any) => (
    <Pressable
      style={styles.audioItem}
      onPress={() => handleAudioSelection(item)}
    >
      <Text style={styles.audioItemText}>{item.filename}</Text>
    </Pressable>
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.colors.whiteColor }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.primary
        }}
        activeOffsetY={[-1, 1]}
        animateOnMount={true}
        failOffsetX={[-5, 5]}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text isBold={true} style={styles.headingText}>
            Add Contact
          </Text>
          <View style={styles.formContainer}>
            <Text>Contact Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter contact's name"
              style={styles.inputBox}
              placeholderTextColor={theme.colors.placeholder}
              selectionColor={theme.colors.primary}
            />
            <Text>Phone Number</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter contact's phone number"
              keyboardType="numeric"
              style={styles.inputBox}
              placeholderTextColor={theme.colors.placeholder}
              selectionColor={theme.colors.primary}
            />
            <Text>Sample Voice</Text>

            {audioAsset && (
              <Text style={styles.audioFileName}>
                {audioAsset && audioAsset.filename}
              </Text>
            )}

            <Pressable style={styles.audioButton} onPress={handleSelectAudio}>
              <Text style={styles.audioButtonText}>
                {audioAsset ? 'Change Audio File' : 'Select Audio File'}
              </Text>
            </Pressable>

            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Plus fill={theme.colors.whiteColor} width={24} height={24} />
              <Text isWhite={true} style={styles.submitButtonText}>
                Add Contact
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <Modal
        visible={isAudioListVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsAudioListVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} isBold={true}>
              Select an Audio File
            </Text>
            <FlatList
              data={audioList}
              renderItem={renderAudioItem}
              keyExtractor={(item) => item.id}
              style={styles.audioList}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsAudioListVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </BottomSheetModalProvider>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15
  },
  formContainer: {
    flex: 1,
    paddingVertical: 15
  },
  headingText: {
    fontSize: theme.fontSize.xl,
    textAlign: 'center'
  },
  inputBox: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.default,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginBottom: 10,
    marginTop: 5
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.default,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    bottom: 12,
    width: '100%'
  },
  submitButtonText: {
    fontSize: theme.fontSize.lg
  },
  audioButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.default,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary
  },
  audioButtonText: {
    color: theme.colors.blackColor
  },
  audioFileName: {
    fontSize: theme.fontSize.xs,
    marginVertical: 2
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  modalContent: {
    backgroundColor: theme.colors.whiteColor,
    borderRadius: theme.borderRadius.default,
    padding: 20,
    width: '90%',
    maxHeight: '90%'
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: theme.colors.primary
  },
  audioList: {
    maxHeight: 300
  },
  audioItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background
  },
  audioItemText: {
    fontSize: theme.fontSize.sm
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.default,
    padding: 10,
    alignItems: 'center',
    marginTop: 10
  },
  closeButtonText: {
    color: theme.colors.whiteColor
  }
}));

export default AddContactSheet;
