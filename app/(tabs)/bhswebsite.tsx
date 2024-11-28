import {WebView} from 'react-native-webview'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView source={{ uri: 'https://bhs.brookline.k12.ma.us/' }}></WebView>
    </SafeAreaView>
  )
}
