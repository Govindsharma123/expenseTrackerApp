import messaging from '@react-native-firebase/messaging';
import {POST, Toast} from '../Backend/Backend';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get FCM Token
export async function getFCMToken(userData) {
  try {
    const token = await messaging().getToken();
    if (token) {
      console.log('FCM Token:', token);
      await saveFCMToken(token, userData);
    } else {
      console.log('Failed to get FCM token');
    }
  } catch (error) {
    console.error('Error fetching FCM token:', error);
  }
}

const saveFCMToken = async (token, userData) => {
  const data = {fcmToken: token};
  const role = userData?.user?.accountType;
  const email = userData?.user?.email;
  await POST(
    `/${role}/SaveFcmToken`,
    data,
    response => {
      console.log('fcm token saved:', response);
    },
    error => {
      console.log('Error in saving Fcm token:', error);
    },
    () => {
      // Fail callback
      console.log('Network failure when changing email');
      Toast('Check your network connection', 'error');
    },
  );
};

// Handle Background & Quit Notifications
export function backgroundMessageHandler() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in background:', remoteMessage);
  });
}
