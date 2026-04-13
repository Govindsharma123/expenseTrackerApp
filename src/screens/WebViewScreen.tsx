import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const APP_URL = 'https://expense-tracker-c2000.web.app/';

export default function WebViewScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <WebView
        source={{ uri: APP_URL }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
  },
});
