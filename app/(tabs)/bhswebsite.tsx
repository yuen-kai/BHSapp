import { Image, StyleSheet, Platform } from 'react-native';
import {WebView} from 'react-native-webview'
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <WebView source={{ uri: 'https://bhs.brookline.k12.ma.us/' }} style={styles.WebViewStyle}></WebView>
  )
}

const styles = StyleSheet.create({
  WebViewStyle: {
    flex: 1,
  }
});
