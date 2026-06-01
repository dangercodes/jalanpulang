import { View, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { SurahBase } from '@/services/quranService';
import Svg, { Path } from 'react-native-svg';

interface SurahCardProps {
  surah: SurahBase;
  onPress?: () => void;
}

const OctagonStar = ({ size = 40, color = "#926247" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 1L14.5 4H18.5V8L21 12L18.5 16V20H14.5L12 23L9.5 20H5.5V16L3 12L5.5 8V4H9.5L12 1Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </Svg>
);

export function SurahCard({ surah, onPress }: SurahCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="mb-1">
      <View className="flex-row items-center justify-between py-4 px-2 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center flex-1">
          <View className="items-center justify-center mr-4 w-11 h-11 relative">
            <OctagonStar size={42} color="#926247" />
            <Text className="text-primary-800 dark:text-primary-600 font-bold text-xs absolute">
              {surah.nomor}
            </Text>
          </View>
          <View className="flex-1 pr-4">
            <Text variant="body" weight="semibold" className="text-primary-900 dark:text-gray-100 mb-0.5">
              {surah.namaLatin}
            </Text>
            <Text variant="caption" className="text-gray-500">
              {surah.tempatTurun} • {surah.jumlahAyat} Ayah
            </Text>
          </View>
        </View>
        <Text variant="arabic" className="text-primary-800 dark:text-primary-500 text-xl">
          {surah.nama}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
