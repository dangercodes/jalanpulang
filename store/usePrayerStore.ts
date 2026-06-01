import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PrayerSettings {
  [key: string]: boolean;
}

interface LocationState {
  useGPS: boolean;
  latitude: number | null;
  longitude: number | null;
  name: string;
}

interface PrayerState {
  notifications: PrayerSettings;
  location: LocationState;
  toggleNotification: (prayerName: string) => void;
  setLocation: (location: Partial<LocationState>) => void;
}

export const usePrayerStore = create<PrayerState>()(
  persist(
    (set) => ({
      notifications: {
        Fajr: true,
        Sunrise: false,
        Dhuhr: true,
        Asr: true,
        Maghrib: true,
        Isha: true,
      },
      location: {
        useGPS: true,
        latitude: null,
        longitude: null,
        name: 'My Location (GPS)',
      },
      toggleNotification: (prayerName) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [prayerName]: !state.notifications[prayerName],
          },
        })),
      setLocation: (location) =>
        set((state) => ({
          location: { ...state.location, ...location },
        })),
    }),
    {
      name: 'prayer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
