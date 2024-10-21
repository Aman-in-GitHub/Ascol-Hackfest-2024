import { Pressable, View } from 'react-native';
import React from 'react';
import { SafetyTipsSections } from '@components/tips/SafetyTips';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ScrollView } from 'react-native-gesture-handler';
import Text from '@components/Text';
import { Image } from 'expo-image';

function TipsPage() {
  const { id } = useLocalSearchParams();
  const { styles, theme } = useStyles(stylesheet);
  const router = useRouter();
  const section = SafetyTipsSections[Number(id)];

  return (
    <>
      <Stack.Screen
        options={{
          title: section.title,
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
      <View style={styles.modalContainer}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {section.tips &&
            section.tips.map((tip, index) => {
              return (
                <View key={index} style={styles.tipContainer}>
                  <Text isBold={true} style={styles.tipSubTitle}>
                    0{index + 1} - {tip.subTitle}
                  </Text>
                  <Image
                    transition={500}
                    source={section.images[index]}
                    style={styles.tipImage}
                    contentFit="fill"
                  />

                  <Text style={styles.tipTitle}>{tip.title}</Text>
                </View>
              );
            })}
        </ScrollView>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text isWhite={true} style={styles.buttonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 15
  },
  scrollView: {
    flex: 1,
    paddingVertical: 5
  },
  buttonText: {
    fontSize: theme.fontSize.lg
  },
  tipImage: {
    width: '100%',
    height: 200,
    marginVertical: 5,
    borderRadius: theme.borderRadius.default
  },
  tipContainer: {
    marginBottom: 15
  },
  tipSubTitle: {
    fontSize: theme.fontSize.lg,
    marginBottom: 5,
    color: theme.colors.primary
  },
  tipTitle: {
    fontSize: theme.fontSize.original
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.default,
    padding: 15,
    alignItems: 'center',
    marginVertical: 15
  }
}));

export default TipsPage;
