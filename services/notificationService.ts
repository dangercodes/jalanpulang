import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const ADHAN_URL = 'https://www.islamcan.com/audio/adhan/azan1.mp3';

let lastScheduleTime = 0;

export const updateLastScheduleTime = () => {
  lastScheduleTime = Date.now();
};

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return {
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

// Initialize notification channel and categories for Android
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('adhan-channel-v2', {
    name: 'Prayer Times',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#926247',
    sound: 'adhan.wav', // Required full filename with extension for Android custom sounds
  });
}

// Define notification categories for actions
Notifications.setNotificationCategoryAsync('adhan-category', [
  {
    identifier: 'stop-adhan',
    buttonTitle: 'Stop Adhan',
    options: {
      opensAppToForeground: false,
    },
  },
]);

export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Error requesting permissions:', error);
    return false;
  }
};

export const schedulePrayerNotification = async (name: string, time: string) => {
  try {
    // Robustly parse "HH:mm" from strings like "05:12 (WIB)" or "05:12"
    const timeMatch = time.match(/(\d{1,2}):(\d{1,2})/);
    if (!timeMatch) {
      console.warn(`Invalid time format for ${name}: ${time}`);
      return;
    }
    
    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const now = new Date();

    // Schedule exact DATE triggers for the next 7 days instead of a DAILY trigger.
    // This wakes up Android Doze mode and prevents the 15-20 min delays.
    for (let i = 0; i < 7; i++) {
      let triggerDate = new Date();
      triggerDate.setHours(hours, minutes, 0, 0);
      triggerDate.setDate(triggerDate.getDate() + i);

      // Skip if this specific time has already passed
      if (triggerDate.getTime() < now.getTime()) {
        continue;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${name} Prayer Time`,
          body: `It is time for ${name} prayer.`,
          data: { type: 'adhan', prayerName: name },
          sound: Platform.OS === 'ios' ? 'adhan.wav' : undefined, // Sound is handled by channel on Android
          categoryIdentifier: 'adhan-category',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: 'adhan-channel-v2',
        } as Notifications.NotificationTriggerInput,
      });
    }
  } catch (error) {
    console.error(`Error scheduling notification for ${name}:`, error);
  }
};

export const scheduleTestNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Adhan Notification",
        body: "This is a test. Adhan will play in 10 seconds.",
        data: { type: 'adhan', prayerName: 'Test' },
        sound: Platform.OS === 'ios' ? 'adhan.wav' : undefined,
        categoryIdentifier: 'adhan-category',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
        repeats: false,
        channelId: 'adhan-channel-v2',
      } as Notifications.NotificationTriggerInput,
    });
    return true;
  } catch (error) {
    console.error('Error scheduling test notification:', error);
    return false;
  }
};

export const scheduleTestDailyNotification = async () => {
  try {
    const now = new Date();
    // Schedule for 1 minute from now
    now.setMinutes(now.getMinutes() + 1);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Trigger Test",
        body: `Testing daily repeating trigger for ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
        data: { type: 'adhan', prayerName: 'DailyTest' },
        sound: Platform.OS === 'ios' ? 'adhan.wav' : undefined,
        categoryIdentifier: 'adhan-category',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: now.getHours(),
        minute: now.getMinutes(),
        channelId: 'adhan-channel-v2',
      } as Notifications.NotificationTriggerInput,
    });
    return { hour: now.getHours(), minute: now.getMinutes() };
  } catch (error) {
    console.error('Error scheduling test daily notification:', error);
    return null;
  }
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

let adhanSound: Audio.Sound | null = null;
let isPlaying = false;

export const playAdhan = async () => {
  if (isPlaying) return;
  
  try {
    isPlaying = true;
    if (adhanSound) {
      await adhanSound.unloadAsync();
      adhanSound = null;
    }
    
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/adhan.wav'),
      { shouldPlay: true }
    );
    
    adhanSound = sound;
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        isPlaying = false;
      }
    });

  } catch (error) {
    console.error('Error playing adhan:', error);
    isPlaying = false;
  }
};

export const stopAdhan = async () => {
  isPlaying = false;
  if (adhanSound) {
    try {
      await adhanSound.stopAsync();
      await adhanSound.unloadAsync();
    } catch (e) {
      console.warn('Error stopping adhan:', e);
    }
    adhanSound = null;
  }
};
