import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SplashScreen from './src/screens/SplashScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import { requestMicrophonePermission } from './services/microphonePermission';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleSplashFinish = async () => {
    await requestMicrophonePermission();
    setScreen('webview');
  };

  return (
    <SafeAreaProvider>
      {screen === 'splash' ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <View style={{ flex: 1 }}>
          
          {/* 🔴 Offline Banner */}
          {!isConnected && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                No Internet - Showing offline data
              </Text>
            </View>
          )}

          {/* 📱 WebView */}
          <WebViewScreen isConnected={isConnected} />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#000',
    padding: 8,
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontWeight: '600',
  },
});