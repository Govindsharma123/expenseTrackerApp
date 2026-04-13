import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import WebViewScreen from './src/screens/WebViewScreen';

type Screen = 'splash' | 'webview';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  return (
    <SafeAreaProvider>
      {screen === 'splash' ? (
        <SplashScreen onFinish={() => setScreen('webview')} />
      ) : (
        <WebViewScreen />
      )}
    </SafeAreaProvider>
  );
}
