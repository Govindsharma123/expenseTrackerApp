import {PermissionsAndroid, Platform} from 'react-native';

export async function requestMicrophonePermission() {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );

    if (alreadyGranted) {
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone permission',
        message:
          'My Money needs microphone access to support voice input features.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.log('Microphone permission request failed:', error);
    return false;
  }
}
