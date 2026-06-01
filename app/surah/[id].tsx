import { View, FlatList, ActivityIndicator, TouchableOpacity, Share, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { AyahRow } from '@/components/quran/AyahRow';
import { useQuery } from '@tanstack/react-query';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useQuranStore } from '@/store/useQuranStore';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getSurahDetail } from '@/services/quranService';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef } from 'react';

export default function SurahDetailScreen() {
  const { id, ayah } = useLocalSearchParams();
  const surahNumber = Number(id);
  const startAyah = ayah ? Number(ayah) : 1;
  const colorScheme = useColorScheme();
  
  const bookmarks = useQuranStore((state) => state.bookmarks);
  const setLastRead = useQuranStore((state) => state.setLastRead);
  const addBookmark = useQuranStore((state) => state.addBookmark);
  const removeBookmark = useQuranStore((state) => state.removeBookmark);
  const { arabicFontSize } = useSettingsStore();

  const isBookmarked = (sNum: number, aNum: number) => 
    bookmarks.some(b => b.surahNumber === sNum && b.ayahNumber === aNum);

  const { playSound, stopSound, isPlaying, currentPlayingAyah } = useAudioPlayer();

  const { data: surah, isLoading } = useQuery({
    queryKey: ['surah', surahNumber],
    queryFn: () => getSurahDetail(surahNumber),
  });

  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (surah && startAyah >= 1) {
      const timer = setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: startAyah - 1,
          animated: false,
          viewPosition: 0,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [surah, startAyah]);

  const handleBookmark = useCallback((ayahNumber: number) => {
    if (isBookmarked(surahNumber, ayahNumber)) {
      removeBookmark(surahNumber, ayahNumber);
    } else {
      addBookmark(surahNumber, ayahNumber);
      setLastRead({
        surahNumber: surah?.nomor || 0,
        surahName: surah?.namaLatin || '',
        ayahNumber: ayahNumber,
      });
    }
  }, [surah, surahNumber, bookmarks, addBookmark, removeBookmark, setLastRead]);

  const handleShare = useCallback(async (ayah: any) => {
    if (!surah) return;
    try {
      await Share.share({
        message: `${surah.namaLatin} Ayat ${ayah.nomorAyat}\n\n${ayah.teksArab}\n\n${ayah.teksIndonesia}\n\nShared via JalanPulang`,
      });
    } catch (error) {
      console.error(error);
    }
  }, [surah]);

  const handlePlay = useCallback((ayahNumber: number, audioUrls: Record<string, string>) => {
    if (isPlaying && currentPlayingAyah === ayahNumber) {
      stopSound();
    } else {
      const url = audioUrls['05'] || Object.values(audioUrls)[0];
      if (url) {
        playSound(url, ayahNumber, () => {
          if (surah && ayahNumber < surah.jumlahAyat) {
            const nextAyah = surah.ayat[ayahNumber]; 
            if (nextAyah) {
              handlePlay(nextAyah.nomorAyat, nextAyah.audio);
              listRef.current?.scrollToIndex({
                index: ayahNumber,
                animated: true,
                viewPosition: 0.5
              });
            }
          }
        });
      }
    }
  }, [isPlaying, currentPlayingAyah, playSound, stopSound, surah]);

  const renderAyahItem = useCallback(({ item }: { item: any }) => (
    <AyahRow
      ayah={item}
      surahNumber={surah?.nomor || 0}
      isBookmarked={isBookmarked(surah?.nomor || 0, item.nomorAyat)}
      isPlaying={isPlaying && currentPlayingAyah === item.nomorAyat}
      arabicFontSize={arabicFontSize}
      onBookmark={() => handleBookmark(item.nomorAyat)}
      onPlay={() => handlePlay(item.nomorAyat, item.audio)}
      onShare={() => handleShare(item)}
    />
  ), [surah?.nomor, bookmarks, isPlaying, currentPlayingAyah, handleBookmark, handlePlay, handleShare]);

  if (isLoading || !surah) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark justify-center items-center">
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-row items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2">
          <ChevronLeft size={24} color={colorScheme === 'dark' ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
        <View>
          <Text variant="h2" weight="bold">{surah.namaLatin}</Text>
          <Text variant="caption">{surah.arti} • {surah.jumlahAyat} Ayahs</Text>
        </View>
      </View>
      
      <FlatList
        ref={listRef}
        data={surah.ayat}
        keyExtractor={(item) => item.nomorAyat.toString()}
        onScrollToIndexFailed={(info) => {
          // If scroll fails, try to jump to offset first to trigger rendering
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: false,
          });
          setTimeout(() => {
            listRef.current?.scrollToIndex({ 
              index: info.index, 
              animated: false,
              viewPosition: 0 
            });
          }, 100);
        }}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderAyahItem}
        initialNumToRender={Math.min(startAyah + 10, 50)}
        maxToRenderPerBatch={20}
        windowSize={21}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}
