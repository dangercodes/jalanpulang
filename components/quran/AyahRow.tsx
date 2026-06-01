import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ayah } from '@/services/quranService';
import { Bookmark, Pause, Play, Share2 } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '../ui/Text';

interface AyahRowProps {
  ayah: Ayah;
  surahNumber: number;
  isBookmarked: boolean;
  isPlaying: boolean;
  onBookmark: () => void;
  onPlay: () => void;
  onShare: () => void;
  arabicFontSize?: number;
}

export const AyahRow = React.memo(({ ayah, isBookmarked, isPlaying, onBookmark, onPlay, onShare, arabicFontSize = 24 }: AyahRowProps) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'; // gray-400 / gray-500
  const activeIconColor = '#10B981'; // emerald-500

  return (
    <View className="py-6 border-b border-gray-100 dark:border-gray-800">
      <View className="flex-row items-center justify-between mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
        <View className="w-8 h-8 bg-primary-500 rounded-full items-center justify-center">
          <Text className="text-white text-xs font-bold">{ayah.nomorAyat}</Text>
        </View>
        <View className="flex-row items-center space-x-4 gap-4">
          <TouchableOpacity onPress={onPlay} className="p-2">
            {isPlaying ? (
              <Pause size={20} color={activeIconColor} fill={activeIconColor} />
            ) : (
              <Play size={20} color={iconColor} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} className="p-2">
            <Share2 size={20} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onBookmark} className="p-2">
            <Bookmark size={20} color={isBookmarked ? activeIconColor : iconColor} fill={isBookmarked ? activeIconColor : 'transparent'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text 
        variant="arabic" 
        className="mb-6" 
        style={{ fontSize: arabicFontSize, lineHeight: arabicFontSize * 1.8 }}
      >
        {ayah.teksArab}
      </Text>
      
      <Text variant="body" weight="medium" className="mb-2 text-primary-700 dark:text-primary-400">
        {ayah.teksLatin}
      </Text>
      
      <Text variant="body" className="text-gray-600 dark:text-gray-300">
        {ayah.teksIndonesia}
      </Text>
    </View>
  );
});
