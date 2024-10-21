import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Text from '@/components/Text';
import WebView from 'react-native-webview';

export const SelfDefenseSections = [
  {
    title: 'Personal Space',
    subtitle: 'When someone invades your personal space.',
    video: 'https://www.youtube.com/embed/blCXFWyTP_k?si=aImi4fSr5LG1XHvn'
  },
  {
    title: 'Hair Pull',
    subtitle: 'When someone pulls you by your hair.',
    video: 'https://www.youtube.com/embed/J4zq2bdhS-4?si=D9--oiQBGvQQzj6j'
  },
  {
    title: 'Arm Grab',
    subtitle: 'When someone grabs you by your arm.',
    video: 'https://www.youtube.com/embed/LoEHxqX3k3c?si=HMOmhhzPjHA0rxLw'
  }
];

function SelfDefense() {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" translucent={true} hidden={false} />
      <Text isBold={true} style={styles.heading}>
        Be your own shield
      </Text>
      <Text style={styles.tip}>
        TIP -{' '}
        <Text
          style={{
            color: theme.colors.danger,
            textDecorationLine: 'line-through',
            fontSize: theme.fontSize.sm
          }}
        >
          Attack
        </Text>{' '}
        Running is the best form of defense
      </Text>
      {SelfDefenseSections.map((section, index) => (
        <View key={index} style={styles.videoContainer}>
          <Text isBold={true} style={styles.videoTitle}>
            0{index + 1} - {section.title}
          </Text>
          <WebView
            style={styles.webView}
            source={{ uri: section.video }}
            javaScriptEnabled={true}
            
          />
          <Text style={styles.videoSubTitle}>{section.subtitle}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8
  },
  videoContainer: {
    gap: 3,
    marginBottom: 10
  },
  heading: {
    fontSize: theme.fontSize.xl,
    marginTop: 5
  },
  tip: {
    fontSize: theme.fontSize.sm,
    marginVertical: 5
  },
  videoTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary
  },
  videoSubTitle: {
    fontSize: theme.fontSize.sm,
    marginHorizontal: 'auto'
  },
  webView: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.default
  }
}));

export default SelfDefense;
