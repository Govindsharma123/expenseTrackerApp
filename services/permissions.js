import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {getFCMToken} from './firebase';

// Request Notification Permissions
export async function requestUserPermission(userData) {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getFCMToken(userData);
        console.log('Notification permission granted');
        ToastAndroid.show('Notification permission granted', ToastAndroid.SHORT);
      } else {
        console.log('Notification permission denied');
        ToastAndroid.show('Notification permission denied', ToastAndroid.SHORT);

      }
    } catch (error) {
      console.log('Permission request error:', error);
    }
  }
}
