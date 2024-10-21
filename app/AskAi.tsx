import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '@/components/Text';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Send from '@/assets/icons/Send.svg';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';

const apiKey =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  'AIzaSyAURMbC1CYx-vLlM2USN-37TmAfltTUWTs';

type InsightResponse = {
  status: number;
  response: {
    safe_places: string[];
    unsafe_places: string[];
    dos: string[];
    donts: string[];
    culture_tips: string[];
  };
};

function AskAi() {
  const { styles, theme } = useStyles(stylesheet);
  const [fetchedInsights, setFetchedInsights] =
    useState<InsightResponse | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFetchedInsights(null);
    setIsLoading(false);

    if (inputValue.trim().length === 0) {
      setIsLoading(false);
      setFetchedInsights(null);
    }
  }, [inputValue]);

  useEffect(() => {
    return () => {
      setIsLoading(false);
      setFetchedInsights(null);
      setInputValue('');
    };
  }, []);

  async function fetchLocationInsights() {
    const place = inputValue.trim();

    if (place.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Input',
        text2: 'Enter a valid location'
      });

      return;
    }

    setFetchedInsights(null);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `For the place ${place}, provide information in JSON format only, with no additional text. The JSON should have the following keys:
      - safe_places
      - unsafe_places
      - dos
      - donts
      - culture_tips
  
      Each key should contain an array of relevant information. Ensure the output is valid JSON.`;

    setIsLoading(true);

    const result = await model.generateContent(prompt);

    try {
      const data = JSON.parse(result.response.text());

      const response = {
        status: 200,
        response: data
      };

      setIsLoading(false);

      setFetchedInsights(response);
    } catch (error) {
      console.error('Error', error);
      setFetchedInsights(null);
      setIsLoading(false);

      Toast.show({
        type: 'error',
        text1: 'Place not found',
        text2: 'Try a different place'
      });
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Surakshya AI',
          statusBarStyle: 'light',
          header(props) {
            return (
              <LinearGradient
                colors={['#a2d2ff', '#8900f2', '#ffafcc']}
                style={styles.aiHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    color: theme.colors.whiteColor,
                    fontFamily: 'HeadingFont',
                    marginTop: 15
                  }}
                >
                  Surakshya AI
                </Text>
              </LinearGradient>
            );
          }
        }}
      />
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Where do you want to go?"
            style={styles.textInput}
            selectionColor={theme.colors.primary}
            placeholderTextColor={'#a0522d70'}
            value={inputValue}
            onChangeText={setInputValue}
          />

          <LinearGradient
            colors={['#a2d2ff', '#8900f2', '#ffafcc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendBtn}
          >
            <Pressable onPress={fetchLocationInsights}>
              <Send fill={theme.colors.whiteColor} width={30} height={30} />
            </Pressable>
          </LinearGradient>
        </View>

        {fetchedInsights && !isLoading ? (
          <ScrollView style={styles.scrollView}>
            <View>
              <Text isBold={true} style={styles.sectionTitle}>
                Safe places to visit in {inputValue?.trim()}
              </Text>

              {fetchedInsights?.response.safe_places.map((place, index) => {
                return (
                  <Text key={index} style={styles.sectionText}>
                    {index + 1}. {place}
                  </Text>
                );
              })}
            </View>

            <View>
              <Text isBold={true} style={styles.sectionTitle}>
                Unsafe places to avoid in {inputValue?.trim()}
              </Text>

              {fetchedInsights?.response.unsafe_places.map((place, index) => {
                return (
                  <Text key={index} style={styles.sectionText}>
                    {index + 1}. {place}
                  </Text>
                );
              })}
            </View>

            <View>
              <Text isBold={true} style={styles.sectionTitle}>
                Things to do in {inputValue?.trim()}
              </Text>

              {fetchedInsights?.response.dos.map((place, index) => {
                return (
                  <Text key={index} style={styles.sectionText}>
                    {index + 1}. {place}
                  </Text>
                );
              })}
            </View>

            <View>
              <Text isBold={true} style={styles.sectionTitle}>
                Things to avoid doing in {inputValue?.trim()}
              </Text>

              {fetchedInsights?.response.donts.map((place, index) => {
                return (
                  <Text key={index} style={styles.sectionText}>
                    {index + 1}. {place}
                  </Text>
                );
              })}
            </View>

            <View>
              <Text isBold={true} style={styles.sectionTitle}>
                Cultural tips in {inputValue?.trim()}
              </Text>

              {fetchedInsights?.response.culture_tips.map((place, index) => {
                return (
                  <Text key={index} style={styles.sectionText}>
                    {index + 1}. {place}
                  </Text>
                );
              })}
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1
            }}
          >
            {isLoading ? (
              <View
                style={{
                  marginTop: '60%',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <ActivityIndicator size="large" color="#a0522d" />
                <Text
                  style={{
                    fontSize: theme.fontSize.lg,
                    textAlign: 'center',
                    fontFamily: 'HeadingFont'
                  }}
                >
                  Loading Insights For {inputValue?.trim()}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  marginTop: '70%',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <Text
                  style={{
                    fontSize: theme.fontSize.xl,
                    textAlign: 'center',
                    fontFamily: 'HeadingFont'
                  }}
                >
                  Type your destination
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: 20
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  textInput: {
    borderWidth: 2,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '80%',
    borderRadius: theme.borderRadius.rounded,
    borderColor: theme.colors.primary,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    paddingTop: 5,
    fontFamily: 'HeadingFont'
  },
  sectionText: {},
  scrollView: {
    paddingHorizontal: 15
  },
  aiHeader: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendBtn: {
    backgroundColor: theme.colors.blue,
    borderRadius: theme.borderRadius.rounded,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

export default AskAi;
