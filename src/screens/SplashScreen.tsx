import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D1B8E" translucent />

      {/* Icon block */}
      <View style={styles.iconWrapper}>
        <View style={styles.iconCircle}>
          <Text style={styles.rupeeSymbol}>₹</Text>
        </View>
        {/* Bar chart rows */}
        <View style={styles.chartRow}>
          <View style={[styles.bar, { height: 18, opacity: 0.5 }]} />
          <View style={[styles.bar, { height: 26, opacity: 0.65 }]} />
          <View style={[styles.bar, { height: 36, opacity: 0.8 }]} />
          <View style={[styles.bar, { height: 48 }]} />
        </View>
      </View>

      {/* App name */}
      <Text style={styles.appName}>Expense Tracker</Text>
      <Text style={styles.tagline}>Smart money management</Text>

      {/* Loader pinned to bottom */}
      <ActivityIndicator
        size="large"
        color="rgba(255,255,255,0.6)"
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D1B8E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  rupeeSymbol: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },
  bar: {
    width: 10,
    borderRadius: 3,
    backgroundColor: '#A78BFA',
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 48,
  },
  loader: {
    position: 'absolute',
    bottom: 50,
  },
});
