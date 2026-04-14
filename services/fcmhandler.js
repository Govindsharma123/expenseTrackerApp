import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { leaveResponse, rateModal } from '../redux/action';

export function handleForegroundNotifications(dispatch) {
  messaging().onMessage(async remoteMessage => {
    console.log('Received Foreground Notification:', remoteMessage);


    // 🎯 Continue to show the usual notification as well
    await notifee.requestPermission();

    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'New Notification',
      body: remoteMessage.notification?.body || 'You have a new message!',
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher', // Make sure this icon exists in android/app/src/main/res
      },
    });
        const type = remoteMessage?.notification?.body;
    // ✅ Show custom popup only for specific type
  if (type === 'Votre rendez-vous a été complété avec succès.') {
        dispatch(rateModal(true))
} else {
  console.log('Setting Rate to null');
        dispatch(rateModal(false))
}
  if (type === 'Votre demande de congé a été approuvée.') { 
        dispatch(leaveResponse(type))
} else if (type === 'Votre demande de congé a été rejetée.') {
        dispatch(leaveResponse(type))
}
else {
  dispatch(leaveResponse(null))

}

  });
}