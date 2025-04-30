import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 10 }}>
      <WebView source={{ uri: "https://bhs.brookline.k12.ma.us/" }} />
    </SafeAreaView>
  );
}
