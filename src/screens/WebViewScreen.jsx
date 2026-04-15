import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  Linking,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {WebView} from 'react-native-webview';

const APP_URL = 'https://expense-tracker-c2000.web.app/';
const AUTH_REDIRECT_URL = 'expensetracker://auth';
const LOGIN_URL = `${APP_URL}login?redirect=${encodeURIComponent(
  AUTH_REDIRECT_URL,
)}`;

export default function WebViewScreen() {
  const webViewRef = useRef(null);

  const [theme, setTheme] = useState('light');
  const [webViewKey, setWebViewKey] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const refreshWebSession = () => {
    setWebViewKey(prev => prev + 1);
  };

  // 🔁 Reload on app foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        webViewRef.current?.reload();
      }
    });

    return () => subscription.remove();
  }, []);

  // 🔗 Deep link handling (same as your code)
  useEffect(() => {
    const handleDeepLink = async event => {
      const returnedUrl = event?.url;
      if (!returnedUrl?.startsWith(AUTH_REDIRECT_URL)) return;

      try {
        await InAppBrowser.closeAuth();
      } catch {}

      refreshWebSession();
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then(url => {
      if (url?.startsWith(AUTH_REDIRECT_URL)) {
        handleDeepLink({url});
      }
    });

    return () => subscription.remove();
  }, []);

  const openGoogleLogin = async () => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(
          LOGIN_URL,
          AUTH_REDIRECT_URL,
          {
            showTitle: true,
            enableUrlBarHiding: true,
          },
        );

        if (
          result.type === 'success' &&
          result.url?.startsWith(AUTH_REDIRECT_URL)
        ) {
          refreshWebSession();
        }
        return;
      }

      await Linking.openURL(LOGIN_URL);
    } catch (error) {
      console.log('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#000000' : '#FFFFFF'}
      />

      <WebView
        key={webViewKey}
        ref={webViewRef}
        source={{uri: APP_URL}}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        cacheEnabled={true}
        onLoad={() => setHasLoadedOnce(true)} // ✅ important
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        geolocationEnabled
        allowsFullscreenVideo
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={request => {
          if (request.url?.startsWith(AUTH_REDIRECT_URL)) {
            refreshWebSession();
            return false;
          }
          return true;
        }}
        onPermissionRequest={event => {
          event.grant(event.resources);
        }}
        onMessage={event => {
          const message = event.nativeEvent.data;

          if (message === 'GOOGLE_LOGIN') {
            openGoogleLogin();
            return;
          }

          if (message === 'dark' || message === 'light') {
            setTheme(message);
          }
        }}
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
  banner: {
    backgroundColor: '#ff3b30',
    padding: 8,
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    marginTop: 10,
    color: 'gray',
  },
});