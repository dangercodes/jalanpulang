import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CalculationMethod = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Jafari';
export type AppLanguage = 'id' | 'en';

interface SettingsState {
  arabicFontSize: number;
  calculationMethod: CalculationMethod;
  language: AppLanguage;
  notificationsEnabled: boolean;
  
  setArabicFontSize: (size: number) => void;
  setCalculationMethod: (method: CalculationMethod) => void;
  setLanguage: (lang: AppLanguage) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      arabicFontSize: 24,
      calculationMethod: 'MWL',
      language: 'id',
      notificationsEnabled: true,
      
      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      setCalculationMethod: (method) => set({ calculationMethod: method }),
      setLanguage: (lang) => set({ language: lang }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
