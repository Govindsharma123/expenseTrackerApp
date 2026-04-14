import React, {useEffect, useRef, useState} from 'react';
import {AppState, Linking, StatusBar, StyleSheet, View} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {WebView} from 'react-native-webview';

const APP_URL = 'https://expense-tracker-c2000.web.app/';
const AUTH_REDIRECT_URL = 'expensetracker://auth';
const LOGIN_URL = `${APP_URL}login?redirect=${encodeURIComponent(
  AUTH_REDIRECT_URL,
)}`;

const IFRAME_DIAGNOSTIC_SCRIPT = `
  (function () {
    if (window.__RN_IFRAME_DIAGNOSTIC_INSTALLED__) {
      return true;
    }

    window.__RN_IFRAME_DIAGNOSTIC_INSTALLED__ = true;

    function collectIframes() {
      var frames = Array.from(document.querySelectorAll('iframe')).map(function (frame, index) {
        return {
          index: index,
          id: frame.id || null,
          title: frame.title || null,
          src: frame.getAttribute('src') || null,
          allow: frame.getAttribute('allow') || null,
        };
      });

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'iframe-diagnostic',
        count: frames.length,
        frames: frames,
      }));
    }

    collectIframes();

    var observer = new MutationObserver(function () {
      collectIframes();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'allow', 'title', 'id'],
    });

    window.addEventListener('load', collectIframes);
    setTimeout(collectIframes, 1500);
    setTimeout(collectIframes, 4000);

    return true;
  })();
`;

export default function WebViewScreen() {
  const webViewRef = useRef(null);
  const [theme, setTheme] = useState('light');
  const [webViewKey, setWebViewKey] = useState(0);

  const refreshWebSession = () => {
    setWebViewKey(prev => prev + 1);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        webViewRef.current?.reload();
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const handleDeepLink = async event => {
      const returnedUrl = event?.url;
      if (!returnedUrl?.startsWith(AUTH_REDIRECT_URL)) {
        return;
      }

      console.log('Returned:', returnedUrl);

      try {
        await InAppBrowser.closeAuth();
      } catch (error) {
        // Ignore close errors if the auth browser is already gone.
      }

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
            enableDefaultShare: false,
            ephemeralWebSession: false,
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
        injectedJavaScript={IFRAME_DIAGNOSTIC_SCRIPT}
        onMessage={event => {
          const message = event.nativeEvent.data;

          if (message === 'GOOGLE_LOGIN') {
            openGoogleLogin();
            return;
          }
          try {
            const parsedMessage = JSON.parse(message);

            if (parsedMessage.type === 'iframe-diagnostic') {
              console.log('WebView iframe diagnostic:', parsedMessage);
              return;
            }
          } catch (error) {
            // Ignore non-JSON messages and continue with the theme flow.
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
});
