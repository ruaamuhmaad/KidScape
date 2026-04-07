import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import HomePage from '../home';

export default function HomeScreen() {
  return (
   <HomePage></HomePage>
  
  );
  const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  });
}
