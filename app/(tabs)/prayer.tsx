import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Check, ChevronDown, Clock, Compass, MapPin, RefreshCcw, XCircle } from 'lucide-react-native';
import { PrayerCard } from '@/components/prayer/PrayerCard';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import { useNextPrayer } from '@/hooks/useNextPrayer';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { getQiblaDirection } from '@/services/prayerService';
import * as NotificationService from '@/services/notificationService';
import { usePrayerStore } from '@/store/usePrayerStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useQuery } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Animated, Easing } from 'react-native';

const CITIES = [
  { name: 'My Location (GPS)', useGPS: true, latitude: null, longitude: null },
  { name: 'Bogor', useGPS: false, latitude: -6.5961, longitude: 106.7988 },
  { name: 'Jakarta', useGPS: false, latitude: -6.2088, longitude: 106.8456 },
  { name: 'Surabaya', useGPS: false, latitude: -7.2575, longitude: 112.7521 },
  { name: 'Bandung', useGPS: false, latitude: -6.9175, longitude: 107.6191 },
  { name: 'Medan', useGPS: false, latitude: 3.5952, longitude: 98.6722 },
  { name: 'Makassar', useGPS: false, latitude: -5.1476, longitude: 119.4327 },
];

export default function PrayerScreen() {
  const [isReady, setIsReady] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Delay rendering complex NativeWind components until the first paint is complete
    // This prevents the 'Navigation context' crash during Expo deep-link reloads
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const { location, prayerData, address, isLoading, isRefreshing, refresh, errorMsg } = usePrayerTimes();
  
  useEffect(() => {
    if (isRefreshing) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [isRefreshing]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Fetch Qibla Direction
  const { data: qiblaData, isLoading: isLoadingQibla } = useQuery({
    queryKey: ['qibla', location?.coords?.latitude, location?.coords?.longitude],
    queryFn: () => getQiblaDirection(location?.coords?.latitude!, location?.coords?.longitude!),
    enabled: !!location?.coords?.latitude && !!location?.coords?.longitude,
    staleTime: 1000 * 60 * 60 * 24, // Qibla doesn't change, cache for 24h
  });

  const { nextPrayerName, nextPrayerTime, activePrayerName, timeRemaining, isLoading: isLoadingNext } = useNextPrayer();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const lastScheduleTimeRef = useRef(0);
  const lastUpdateRef = useRef('');
  const lastPlayedAdhanRef = useRef('');
  const isMountedRef = useRef(false);
  const { notifications, toggleNotification, location: storeLocation, setLocation: setStoreLocation } = usePrayerStore();
  const { notificationsEnabled } = useSettingsStore();

  useEffect(() => {
    const permTimeout = setTimeout(async () => {
      await NotificationService.requestNotificationPermissions();
    }, 1500);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      if (!isMountedRef.current) return;
      const data = notification.request.content.data;
      if (data?.type === 'adhan') {
        NotificationService.playAdhan();
        setIsAdhanPlaying(true);
      }
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.actionIdentifier === 'stop-adhan' || response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        NotificationService.stopAdhan();
        setIsAdhanPlaying(false);
      }
    });

    const mountTimeout = setTimeout(() => {
      isMountedRef.current = true;
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(mountTimeout);
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (prayerData) {
      const updateKey = JSON.stringify(notifications) + prayerData.date.timestamp + notificationsEnabled.toString();
      if (lastUpdateRef.current !== updateKey) {
        lastUpdateRef.current = updateKey;
        updateNotifications().catch(err => console.warn('Notification update failed:', err));
      }
    }
  }, [notifications, prayerData, notificationsEnabled]);

  useEffect(() => {
    if (prayerData && !isAdhanPlaying && notificationsEnabled) {
      const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
      
      const timingsToCheck = [
        { name: 'Fajr', time: prayerData.timings.Fajr },
        { name: 'Dhuhr', time: prayerData.timings.Dhuhr },
        { name: 'Asr', time: prayerData.timings.Asr },
        { name: 'Maghrib', time: prayerData.timings.Sunset },
        { name: 'Isha', time: prayerData.timings.Isha },
      ];

      for (const item of timingsToCheck) {
        if (notifications[item.name as keyof typeof notifications] && getMinutes(item.time) === currentMinutes) {
          // Prevent playing multiple times in the same minute
          const playKey = item.name + currentMinutes;
          if (lastPlayedAdhanRef.current !== playKey) {
            lastPlayedAdhanRef.current = playKey;
            NotificationService.playAdhan();
            setIsAdhanPlaying(true);
          }
          break;
        }
      }
    }
  }, [currentTime, prayerData, notifications, isAdhanPlaying, notificationsEnabled]);


  const updateNotifications = async () => {
    try {
      const now = Date.now();
      lastScheduleTimeRef.current = now;
      NotificationService.updateLastScheduleTime();
      await NotificationService.cancelAllNotifications();
      
      if (!prayerData || !notificationsEnabled) return;

      const timingsToSchedule = [
        { name: 'Fajr', time: prayerData.timings.Fajr },
        { name: 'Dhuhr', time: prayerData.timings.Dhuhr },
        { name: 'Asr', time: prayerData.timings.Asr },
        { name: 'Maghrib', time: prayerData.timings.Sunset },
        { name: 'Isha', time: prayerData.timings.Isha },
      ];

      for (const item of timingsToSchedule) {
        if (notifications[item.name]) {
          await NotificationService.schedulePrayerNotification(item.name, item.time);
        }
      }
    } catch (error) {
      console.warn('Error updating notifications:', error);
    }
  };

  const handleStopAdhan = async () => {
    await NotificationService.stopAdhan();
    setIsAdhanPlaying(false);
  };

  const getMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleTogglePrayerNotification = (prayerName: keyof typeof notifications) => {
    if (!notificationsEnabled) {
      Alert.alert(
        'Notifications Disabled', 
        'Please enable notifications in Settings first before setting individual prayer alarms.'
      );
      return;
    }
    toggleNotification(prayerName);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex-row items-center justify-between">
        <Text variant="h1" weight="bold">
          Prayer Times
        </Text>
        <View className="flex-row items-center space-x-2 gap-2">
          <TouchableOpacity 
            onPress={refresh}
            disabled={isRefreshing}
            className="w-10 h-10 items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-full"
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <RefreshCcw size={20} color="#6B7280" />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/qibla')}
            className="w-10 h-10 items-center justify-center bg-primary-50 dark:bg-primary-900/30 rounded-full"
          >
            <Compass size={24} color="#926247" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Next Prayer Card */}
        <View className="bg-[#fcecd9] rounded-[28px] p-6 mb-6 overflow-hidden relative border border-[#f5d9c3]">
          <View className="z-10 w-2/3">
            <Text variant="body" weight="medium" className="text-primary-800 dark:text-primary-800 mb-2">
              The Next Salah
            </Text>
            <Text variant="h1" weight="bold" className="text-primary-900 dark:text-primary-900 mb-1">
              {isLoadingNext ? '...' : nextPrayerTime} <Text variant="body" className="text-primary-700 dark:text-primary-700">GMT+7</Text>
            </Text>
            <Text variant="caption" className="text-primary-700 dark:text-primary-700">
              {nextPrayerName} is in {timeRemaining}
            </Text>
          </View>
          
          {/* Mosque Illustration */}
          <View className="absolute -right-4 -bottom-2 w-40 h-40 opacity-90 z-0">
            <Image 
              source={require('@/assets/images/mosque.png')} 
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => setIsLocationModalVisible(true)}
          className="flex-row items-center justify-between mb-6 bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl items-center justify-center mr-3">
              <MapPin size={20} color="#10B981" />
            </View>
            <View>
              <Text variant="caption" className="text-gray-500">Selected Location</Text>
              <Text variant="body" weight="semibold">
                {storeLocation.useGPS && address ? address : storeLocation.name}
              </Text>
            </View>
          </View>
          <ChevronDown size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* Removed Qibla Direction Card from here */}

        {!isReady || errorMsg ? (
          <Text className="text-red-500 text-center">{errorMsg}</Text>
        ) : isLoading || !location ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="mt-4 text-gray-500">Getting prayer times...</Text>
          </View>
        ) : prayerData ? (
          <View>
            <Text variant="h3" weight="semibold" className="mb-4">
              {prayerData.date.readable}
            </Text>
            <PrayerCard 
              name="Fajr" 
              time={prayerData.timings.Fajr} 
              isActive={activePrayerName === 'Fajr'} 
              isNotified={notificationsEnabled && notifications.Fajr}
              onToggleNotification={() => handleTogglePrayerNotification('Fajr')}
            />
            <PrayerCard 
              name="Sunrise" 
              time={prayerData.timings.Sunrise} 
              isActive={activePrayerName === 'Sunrise'} 
              isNotified={notificationsEnabled && notifications.Sunrise}
              onToggleNotification={() => handleTogglePrayerNotification('Sunrise')}
            />
            <PrayerCard 
              name="Dhuhr" 
              time={prayerData.timings.Dhuhr} 
              isActive={activePrayerName === 'Dhuhr'} 
              isNotified={notificationsEnabled && notifications.Dhuhr}
              onToggleNotification={() => handleTogglePrayerNotification('Dhuhr')}
            />
            <PrayerCard 
              name="Asr" 
              time={prayerData.timings.Asr} 
              isActive={activePrayerName === 'Asr'} 
              isNotified={notificationsEnabled && notifications.Asr}
              onToggleNotification={() => handleTogglePrayerNotification('Asr')}
            />
            <PrayerCard 
              name="Maghrib" 
              time={prayerData.timings.Sunset} 
              isActive={activePrayerName === 'Maghrib'} 
              isNotified={notificationsEnabled && notifications.Maghrib}
              onToggleNotification={() => handleTogglePrayerNotification('Maghrib')}
            />
            <PrayerCard 
              name="Isha" 
              time={prayerData.timings.Isha} 
              isActive={activePrayerName === 'Isha'} 
              isNotified={notificationsEnabled && notifications.Isha}
              onToggleNotification={() => handleTogglePrayerNotification('Isha')}
            />

            {isAdhanPlaying && (
              <TouchableOpacity 
                onPress={handleStopAdhan}
                className="mt-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex-row items-center justify-center border border-red-100 dark:border-red-800"
              >
                <View className="mr-2">
                  <XCircle size={24} color="#EF4444" />
                </View>
                <Text weight="bold" className="text-red-600 dark:text-red-400">Stop Adhan</Text>
              </TouchableOpacity>
            )}

            {/* Test Buttons - Commented out after successful verification */}
            {/* 
            <TouchableOpacity 
              onPress={async () => {
                const success = await NotificationService.scheduleTestNotification();
                if (success) {
                  Alert.alert("Success", "Test Adhan scheduled for 10 seconds from now. You can close the app or lock your screen to test.");
                }
              }}
              className="mt-6 bg-primary-50 dark:bg-primary-900/10 p-4 rounded-2xl flex-row items-center justify-center border border-primary-100 dark:border-primary-800"
            >
              <View className="mr-2">
                <Bell size={20} color="#926247" />
              </View>
              <Text weight="bold" className="text-primary-800 dark:text-primary-300">Test Adhan (10s)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={async () => {
                const result = await NotificationService.scheduleTestDailyNotification();
                if (result) {
                  Alert.alert(
                    "Success", 
                    `Daily Trigger scheduled for ${result.hour}:${result.minute.toString().padStart(2, '0')}. \n\nThis uses the EXACT same logic as real prayer times. Please wait ~1 minute.`
                  );
                }
              }}
              className="mt-4 bg-secondary-50 dark:bg-secondary-900/10 p-4 rounded-2xl flex-row items-center justify-center border border-secondary-100 dark:border-secondary-800"
            >
              <View className="mr-2">
                <Clock size={20} color="#10B981" />
              </View>
              <Text weight="bold" className="text-secondary-800 dark:text-secondary-300">Test Daily Trigger (1 min)</Text>
            </TouchableOpacity>
            */}
          </View>
        ) : null}
        <View className="h-24" />
      </ScrollView>

      {isLocationModalVisible && (
        <View className="absolute top-0 bottom-0 left-0 right-0 z-50 flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-surface-dark rounded-t-[32px] p-6 max-h-[70%] mt-auto">
            <View className="flex-row items-center justify-between mb-6">
              <Text variant="h2" weight="bold">Select Location</Text>
              <TouchableOpacity onPress={() => setIsLocationModalVisible(false)}>
                <XCircle size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={CITIES}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => {
                const isSelected = storeLocation.name === item.name;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setStoreLocation({
                        useGPS: item.useGPS,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        name: item.name,
                      });
                      setIsLocationModalVisible(false);
                    }}
                    className={`flex-row items-center justify-between p-4 rounded-2xl mb-2 ${
                      isSelected ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800' : 'bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View className="mr-3">
                        <MapPin size={20} color={isSelected ? '#10B981' : '#9CA3AF'} />
                      </View>
                      <Text weight={isSelected ? 'bold' : 'medium'} className={isSelected ? 'text-primary-700 dark:text-primary-400' : undefined}>
                        {item.useGPS && isSelected && address ? `My Location (${address})` : item.name}
                      </Text>
                    </View>
                    {isSelected && <Check size={20} color="#10B981" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
