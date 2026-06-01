import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Activity {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface ActivityState {
  activities: Activity[];
  lastResetDate: string | null;
  addActivity: (title: string) => void;
  toggleActivity: (id: string) => void;
  removeActivity: (id: string) => void;
  checkAndResetDaily: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [
        { id: '1', title: 'Morning Dhikr', completed: false, createdAt: Date.now() },
        { id: '2', title: 'Read Quran 15 mins', completed: false, createdAt: Date.now() },
        { id: '3', title: 'Sholat Dhuha', completed: false, createdAt: Date.now() },
      ],
      lastResetDate: null,
      addActivity: (title) =>
        set((state) => ({
          activities: [
            ...state.activities,
            { id: Math.random().toString(36).substring(7), title, completed: false, createdAt: Date.now() },
          ],
        })),
      toggleActivity: (id) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === id ? { ...a, completed: !a.completed } : a
          ),
        })),
      removeActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        })),
      checkAndResetDaily: () => {
        const today = new Date().toDateString();
        const { lastResetDate, activities } = get();
        
        if (lastResetDate !== today) {
          set({
            activities: activities.map(a => ({ ...a, completed: false })),
            lastResetDate: today
          });
        }
      },
    }),
    {
      name: 'activity-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
