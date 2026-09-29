import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  setup: async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  },

  scheduleBudgetAlert: async (category: string, spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Budget Alert!',
          body: `You have spent ${percentage.toFixed(0)}% of your ${category} budget.`,
        },
        trigger: null,
      });
    }
  },

  scheduleReminder: async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Reminder',
        body: 'Don\'t forget to log your expenses today!',
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      } as Notifications.DailyTriggerInput,
    });
  }
};
