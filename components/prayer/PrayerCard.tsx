import { View, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { Bell, BellOff } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { cn } from '@/utils/cn';

interface PrayerCardProps {
  name: string;
  time: string;
  isActive?: boolean;
  isNotified?: boolean;
  onToggleNotification?: () => void;
}

export function PrayerCard({ name, time, isActive, isNotified = true, onToggleNotification }: PrayerCardProps) {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
  const activeColor = '#10B981';

  return (
    <View 
      className={cn(
        'rounded-2xl p-4 flex-row items-center justify-between mb-3',
        isActive 
          ? 'bg-surface-light dark:bg-surface-dark shadow-sm border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
          : 'bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800'
      )}
    >
      <View>
        <Text variant="h3" weight={isActive ? 'bold' : 'semibold'} className={isActive ? 'text-primary-700 dark:text-primary-400' : undefined}>
          {name}
        </Text>
      </View>
      <View className="flex-row items-center gap-4">
        <Text variant="h2" weight="bold" className={isActive ? 'text-primary-700 dark:text-primary-400' : undefined}>
          {time}
        </Text>
        <TouchableOpacity onPress={onToggleNotification} className="p-2">
          {isNotified ? (
            <Bell size={20} color={isActive ? activeColor : iconColor} />
          ) : (
            <BellOff size={20} color={iconColor} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
