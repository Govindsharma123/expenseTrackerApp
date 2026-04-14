import React, {useState} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import {requestMicrophonePermission} from './services/microphonePermission';

export default function App() {
  const [screen, setScreen] = useState('splash');

  const handleSplashFinish = async () => {
    await requestMicrophonePermission();
    setScreen('webview');
  };

  return (
    <SafeAreaProvider>
      {screen === 'splash' ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <WebViewScreen />
      )}
    </SafeAreaProvider>
  );
}
