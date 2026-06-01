import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LastRead {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
}

interface QuranState {
  lastRead: LastRead | null;
  bookmarks: { surahNumber: number; ayahNumber: number }[];
  setLastRead: (lastRead: LastRead) => void;
  addBookmark: (surahNumber: number, ayahNumber: number) => void;
  removeBookmark: (surahNumber: number, ayahNumber: number) => void;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
}

export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      lastRead: null,
      bookmarks: [],
      setLastRead: (lastRead) => set({ lastRead }),
      addBookmark: (surahNumber, ayahNumber) =>
        set({
          bookmarks: [{ surahNumber, ayahNumber }],
        }),
      removeBookmark: (surahNumber, ayahNumber) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter(
            (b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
          ),
        })),
      isBookmarked: (surahNumber, ayahNumber) => {
        return get().bookmarks.some(
          (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
        );
      },
    }),
    {
      name: 'quran-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
