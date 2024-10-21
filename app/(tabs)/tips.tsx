import Text from '@/components/Text';
import SafetyTips from '@/components/tips/SafetyTips';
import SelfDefense from '@/components/tips/SelfDefense';
import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const renderScene = SceneMap({
  first: SafetyTips,
  second: SelfDefense
});

function Tips() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Safety Tips' },
    { key: 'second', title: 'Self Defense' }
  ]);

  const { styles, theme } = useStyles(stylesheet);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      activeColor={theme.colors.primary}
      inactiveColor={'black'}
      style={{ backgroundColor: theme.colors.whiteColor }}
      android_ripple={{
        color: theme.colors.androidRipple
      }}
      indicatorStyle={{
        backgroundColor: theme.colors.primary
      }}
      labelStyle={{
        fontFamily: 'BoldBodyTextFont'
      }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy={({ route }) => route.key === 'second'}
      renderLazyPlaceholder={() => (
        <View style={styles.container}>
          <Text isBold={true} style={styles.loadingText}>
            LOADING VIDEOS
          </Text>
        </View>
      )}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primary,
    fontFamily: 'HeadingFont'
  }
}));

export default Tips;
