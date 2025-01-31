import { StyleSheet, Image, Platform, Text } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSession } from '@/components/Context';
import Ripple from 'react-native-material-ripple';

export default function TabFourScreen() {
  const { signOut } = useSession();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gear"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Account Info:</ThemedText>
      </ThemedView>
      <ThemedText>and so on...</ThemedText>
      <Collapsible title="stuff">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <ThemedView style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
        <Ripple style={styles.logoutButton}
          rippleColor="white"
          rippleOpacity={0.05}
          rippleDuration={300}
          rippleCentered={true}
          rippleContainerBorderRadius={10}
          rippleFades={false}
          onPress={() => {
            signOut();
          }}>
          <Text>Sign Out</Text>
        </Ripple>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    color: '#03b6fc',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#03b6fc',
    borderRadius: 10,
    color: 'white',
    justifyContent: 'center',
    marginTop: 12,
    padding: 10,
    width: 250,
    height: 40,
  },
});
