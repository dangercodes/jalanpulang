import React from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { useQuery } from '@tanstack/react-query';
import { getDoaDetail } from '@/services/doaService';
import { ChevronLeft, Share2, Copy } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Clipboard from 'expo-clipboard';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function DoaDetailScreen() {
  const { id } = useLocalSearchParams();
  const doaId = Number(id);
  const colorScheme = useColorScheme();
  const { arabicFontSize } = useSettingsStore();

  const { data: doa, isLoading } = useQuery({
    queryKey: ['doa', doaId],
    queryFn: () => getDoaDetail(doaId),
  });

  const handleShare = async () => {
    if (!doa) return;
    try {
      await Share.share({
        message: `${doa.nama}\n\n${doa.ar}\n\n${doa.idn}\n\nShared via JalanPulang`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = async () => {
    if (!doa) return;
    await Clipboard.setStringAsync(`${doa.nama}\n\n${doa.ar}\n\n${doa.idn}`);
    // You could add a toast here
  };

  if (isLoading || !doa) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark justify-center items-center">
        <ActivityIndicator size="large" color="#926247" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2">
            <ChevronLeft size={24} color={colorScheme === 'dark' ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
          <Text variant="h3" weight="bold" className="flex-1" numberOfLines={1}>Doa</Text>
        </View>
        <View className="flex-row space-x-2 gap-2">
          <TouchableOpacity onPress={handleCopy} className="p-2">
            <Copy size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} className="p-2">
            <Share2 size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        <Text variant="h2" weight="bold" className="text-primary-900 mb-6 px-2">
          {doa.nama}
        </Text>
        <View className="bg-white dark:bg-surface-dark rounded-[32px] p-8 border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
          <Text 
            variant="arabic" 
            className="text-right mb-8 text-primary-900"
            style={{ fontSize: arabicFontSize, lineHeight: arabicFontSize * 1.8 }}
          >
            {doa.ar}
          </Text>
          
          <View className="h-[1px] bg-gray-100 dark:bg-gray-800 mb-8" />
          
          <Text variant="body" weight="bold" className="text-primary-700 dark:text-primary-400 mb-3">
            Transliteration
          </Text>
          <Text variant="body" className="italic text-gray-700 dark:text-gray-300 mb-8">
            {doa.tr}
          </Text>
          
          <Text variant="body" weight="bold" className="text-primary-700 dark:text-primary-400 mb-3">
            Translation
          </Text>
          <Text variant="body" className="text-gray-600 dark:text-gray-400 leading-6">
            {doa.idn}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
