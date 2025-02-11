import { Image, StyleSheet, Platform, ScrollView } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {IconSymbol} from "@/components/ui/IconSymbol";
import ParallaxScrollView from "@/components/ParallaxScrollView";
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// Currently, the ParallaxScrollView component crashes after authentication.

export default function HomeScreen() {
  return (
      <ParallaxScrollView
          headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
          headerImage={
            <IconSymbol
                size={310}
                color="#808080"
                name="info.circle"
                style={styles.headerImage}
            />
          }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Tutor Search</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
