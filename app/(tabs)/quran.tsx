import { SurahCard } from '@/components/quran/SurahCard';
import { Text } from '@/components/ui/Text';
import { getSurahList } from '@/services/quranService';
import { useQuranStore } from '@/store/useQuranStore';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ChevronRight, Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, TextInput, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCcw } from 'lucide-react-native';

export default function QuranScreen() {
  const [activeTab, setActiveTab] = useState('Surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const lastRead = useQuranStore((state) => state.lastRead);

  const { data: surahs, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['surahs'],
    queryFn: getSurahList,
  });

  const filteredSurahs = useMemo(() => {
    if (!surahs) return [];
    if (!searchQuery) return surahs;
    return surahs.filter(s => 
      s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.arti.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [surahs, searchQuery]);

  const juzList = useMemo(() => {
    const juzStarts = [
      { id: 1, name: 'Juz 1', surah: 1, ayah: 1, surahName: 'Al-Fatihah' },
      { id: 2, name: 'Juz 2', surah: 2, ayah: 142, surahName: 'Al-Baqarah' },
      { id: 3, name: 'Juz 3', surah: 2, ayah: 253, surahName: 'Al-Baqarah' },
      { id: 4, name: 'Juz 4', surah: 3, ayah: 93, surahName: 'Ali \'Imran' },
      { id: 5, name: 'Juz 5', surah: 4, ayah: 24, surahName: 'An-Nisa\'' },
      { id: 6, name: 'Juz 6', surah: 4, ayah: 148, surahName: 'An-Nisa\'' },
      { id: 7, name: 'Juz 7', surah: 5, ayah: 82, surahName: 'Al-Ma\'idah' },
      { id: 8, name: 'Juz 8', surah: 6, ayah: 111, surahName: 'Al-An\'am' },
      { id: 9, name: 'Juz 9', surah: 7, ayah: 88, surahName: 'Al-A\'raf' },
      { id: 10, name: 'Juz 10', surah: 8, ayah: 41, surahName: 'Al-Anfal' },
      { id: 11, name: 'Juz 11', surah: 9, ayah: 93, surahName: 'At-Tawbah' },
      { id: 12, name: 'Juz 12', surah: 11, ayah: 6, surahName: 'Hud' },
      { id: 13, name: 'Juz 13', surah: 12, ayah: 53, surahName: 'Yusuf' },
      { id: 14, name: 'Juz 14', surah: 15, ayah: 1, surahName: 'Al-Hijr' },
      { id: 15, name: 'Juz 15', surah: 17, ayah: 1, surahName: 'Al-Isra\'' },
      { id: 16, name: 'Juz 16', surah: 18, ayah: 75, surahName: 'Al-Kahf' },
      { id: 17, name: 'Juz 17', surah: 21, ayah: 1, surahName: 'Al-Anbiya\'' },
      { id: 18, name: 'Juz 18', surah: 23, ayah: 1, surahName: 'Al-Mu\'minun' },
      { id: 19, name: 'Juz 19', surah: 25, ayah: 21, surahName: 'Al-Furqan' },
      { id: 20, name: 'Juz 20', surah: 27, ayah: 56, surahName: 'An-Naml' },
      { id: 21, name: 'Juz 21', surah: 29, ayah: 46, surahName: 'Al-\'Ankabut' },
      { id: 22, name: 'Juz 22', surah: 33, ayah: 31, surahName: 'Al-Ahzab' },
      { id: 23, name: 'Juz 23', surah: 36, ayah: 28, surahName: 'Ya-Sin' },
      { id: 24, name: 'Juz 24', surah: 39, ayah: 32, surahName: 'Az-Zumar' },
      { id: 25, name: 'Juz 25', surah: 42, ayah: 1, surahName: 'Ash-Shura' },
      { id: 26, name: 'Juz 26', surah: 46, ayah: 1, surahName: 'Al-Ahqaf' },
      { id: 27, name: 'Juz 27', surah: 51, ayah: 31, surahName: 'Adh-Dhariyat' },
      { id: 28, name: 'Juz 28', surah: 58, ayah: 1, surahName: 'Al-Mujadilah' },
      { id: 29, name: 'Juz 29', surah: 67, ayah: 1, surahName: 'Al-Mulk' },
      { id: 30, name: 'Juz 30', surah: 78, ayah: 1, surahName: 'An-Naba\'' },
    ];
    return juzStarts;
  }, []);

  // Stable Header Component to prevent re-mounting and keyboard flickering
  const HeaderComponent = useMemo(() => (
    <View className="pt-4 pb-2">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-8">
        {!isSearching ? (
          <>
            <View className="w-10" />
            <Text variant="h3" weight="bold" className="text-primary-900">
              Quran
            </Text>
            <TouchableOpacity 
              className="p-2 -mr-2"
              onPress={() => setIsSearching(true)}
            >
              <Search size={28} color="#462f21" />
            </TouchableOpacity>
          </>
        ) : (
          <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-1">
            <Search size={20} color="#926247" />
            <TextInput
              autoFocus
              placeholder="Search Surah..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 h-10 ml-2 text-primary-900 dark:text-white"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity onPress={() => {
              setIsSearching(false);
              setSearchQuery('');
            }}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Last Read Card */}
      <TouchableOpacity 
        onPress={() => {
          if (lastRead) {
            router.push({
              pathname: `/surah/${lastRead.surahNumber}`,
              params: { ayah: lastRead.ayahNumber }
            });
          } else {
            router.push('/surah/1');
          }
        }}
        activeOpacity={0.9}
        className="bg-[#fcecd9] rounded-[28px] p-6 mb-8 overflow-hidden relative border border-[#f5d9c3] h-40 flex-row"
      >
        <View className="z-10 flex-1 justify-center">
          <Text variant="caption" weight="medium" className="text-primary-800 dark:text-primary-800 mb-2">
            Last Read
          </Text>
          <Text variant="h2" weight="bold" className="text-primary-900 dark:text-primary-900 mb-1">
            {lastRead ? lastRead.surahName : 'Al-Fatihah'}
          </Text>
          <Text variant="caption" className="text-primary-700 dark:text-primary-700">
            Ayah No. {lastRead ? lastRead.ayahNumber : 1}
          </Text>
        </View>
        
        {/* Quran Illustration */}
        <View className="absolute right-0 bottom-[-10] w-40 h-40 z-0">
          <Image 
            source={require('@/assets/images/quran_illustration.png')} 
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>

      {/* Custom Tabs */}
      <View className="flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800 mb-4 px-2">
        {['Surah', 'Juz'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              className={`pb-4 px-4 ${isActive ? 'border-b-2 border-primary-500' : ''}`}
            >
              <Text 
                variant="body" 
                weight={isActive ? 'bold' : 'medium'}
                className={isActive ? 'text-primary-700 dark:text-primary-500' : 'text-gray-400'}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  ), [isSearching, searchQuery, activeTab, lastRead]);

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#926247" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-6">
          <View className="bg-red-50 dark:bg-red-900/20 p-6 rounded-[32px] items-center w-full border border-red-100 dark:border-red-900/30">
            <RefreshCcw size={48} color="#EF4444" className="mb-4" />
            <Text variant="h3" weight="bold" className="text-red-600 dark:text-red-400 mb-2 text-center">
              Failed to load Surahs
            </Text>
            <Text variant="body" className="text-red-500/70 text-center mb-6">
              Please check your internet connection and try again.
            </Text>
            <TouchableOpacity 
              onPress={() => refetch()}
              className="bg-red-500 px-8 py-4 rounded-2xl flex-row items-center"
            >
              <RefreshCcw size={20} color="white" className="mr-2" />
              <Text weight="bold" className="text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'Surah' ? filteredSurahs : juzList}
          keyExtractor={(item) => (item.nomor || item.id).toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={HeaderComponent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={['#926247']}
              tintColor="#926247"
            />
          }
          renderItem={({ item }) => {
            if (activeTab === 'Surah') {
              return (
                <SurahCard 
                  surah={item} 
                  onPress={() => router.push(`/surah/${item.nomor}`)}
                />
              );
            }
            
            // Render Juz Item
            return (
              <TouchableOpacity 
                className="flex-row items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-2xl mb-3 border border-gray-100 dark:border-gray-800"
                onPress={() => router.push({
                  pathname: `/surah/${item.surah}`,
                  params: { ayah: item.ayah }
                })}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl items-center justify-center mr-4">
                    <Text weight="bold" className="text-primary-700">{item.id}</Text>
                  </View>
                  <View>
                    <Text weight="bold" className="text-gray-900 dark:text-gray-100">{item.name}</Text>
                    <Text variant="caption" className="text-gray-500">
                      Starts at: {item.surahName} Ayah {item.ayah}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
