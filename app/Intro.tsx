import { View, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Stack, useRouter } from 'expo-router';
import Text from '@/components/Text';
import Toast from 'react-native-toast-message';
import zustandStorage from '@/storage/storage';
import { OtpInput } from 'react-native-otp-entry';

function Intro() {
  const { styles, theme } = useStyles(stylesheet);
  const router = useRouter();

  const [contacts, setContacts] = useState({
    primaryContact: '',
    contact02: '',
    contact03: '',
    contact04: '',
    contact05: ''
  });

  function handleInputChange(field: string, value: string) {
    setContacts({
      ...contacts,
      [field]: value
    });
  }

  async function handleSubmit() {
    Toast.hide();

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (
      !contacts.primaryContact ||
      !contacts.contact02 ||
      !contacts.contact03
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in at least the first three contact fields.'
      });
      return;
    }

    zustandStorage.setItem(
      'contactNumbers',
      JSON.stringify([
        contacts.primaryContact,
        contacts.contact02,
        contacts.contact03,
        contacts.contact04,
        contacts.contact05
      ])
    );

    router.replace('/');
  }

  async function handleOtpChange(otp: string) {
    Toast.hide();

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (otp.trim().length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid input',
        text2: 'Enter a valid OTP.'
      });

      return;
    }

    zustandStorage.setItem('userOTP', otp);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'WELCOME TO SURAKSHYA',
          statusBarStyle: 'light',
          headerStyle: {
            backgroundColor: theme.colors.primary
          },
          headerTintColor: theme.colors.whiteColor,
          headerTitleStyle: {
            color: theme.colors.whiteColor,
            fontFamily: 'HeadingFont',
            fontSize: theme.fontSize.lg
          }
        }}
      />
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Primary Contact</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="Enter primary contact"
            selectionColor={theme.colors.primary}
            onChangeText={(value) => handleInputChange('primaryContact', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact No. 02</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="Enter contact 02"
            selectionColor={theme.colors.primary}
            onChangeText={(value) => handleInputChange('contact02', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact No. 03</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact 03"
            keyboardType="phone-pad"
            selectionColor={theme.colors.primary}
            onChangeText={(value) => handleInputChange('contact03', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact No. 04</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact 04"
            keyboardType="phone-pad"
            selectionColor={theme.colors.primary}
            onChangeText={(value) => handleInputChange('contact04', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact No. 05</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact 05"
            keyboardType="phone-pad"
            selectionColor={theme.colors.primary}
            onChangeText={(value) => handleInputChange('contact05', value)}
          />
        </View>

        <View>
          <OtpInput
            numberOfDigits={4}
            onTextChange={handleOtpChange}
            autoFocus={false}
            focusColor={theme.colors.primary}
            secureTextEntry={true}
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.pinCodeContainer
            }}
          />
        </View>

        <Pressable style={styles.saveButton} onPress={handleSubmit}>
          <Text
            isWhite={true}
            isBold={true}
            style={{
              fontSize: theme.fontSize.lg
            }}
          >
            Save Contacts
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: theme.fontSize.lg,
    fontFamily: 'BoldBodyTextFont',
    color: theme.colors.blackColor,
    marginBottom: 5
  },
  input: {
    backgroundColor: theme.colors.whiteColor,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.default,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
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

export default Intro;
