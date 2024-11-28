import { Image, StyleSheet, Platform } from 'react-native';
import {WebView} from 'react-native-webview'
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView source={{ uri: 'https://bhs.brookline.k12.ma.us/' }}></WebView>
    </SafeAreaView>
  )
}
