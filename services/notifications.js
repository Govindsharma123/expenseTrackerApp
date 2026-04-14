import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// Create a Notification Channel for Android
export async function createNotificationChannel() {
  console.log('Creating notification channel...');
  
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
}

// Show Notification using Notifee
export async function displayNotification(remoteMessage) {
  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'New Notification',
    body: remoteMessage.notification?.body || 'You have a new message!',
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
    },
  });
}

// Handle User Click on Notification
export function handleNotificationEvents() {
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('User tapped on foreground notification:', detail.notification);
    }
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('User tapped on background notification:', detail.notification);
    }
  });
}
