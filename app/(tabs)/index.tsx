import { Text } from '@/components/ui/Text';
import { useNextPrayer } from '@/hooks/useNextPrayer';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useActivityStore } from '@/store/useActivityStore';
import { useQuranStore } from '@/store/useQuranStore';
import { router, useRootNavigationState } from 'expo-router';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Compass,
  Gift,
  Moon,
  MoonStar,
  Plus,
  Sun,
  Sunrise,
  Sunset,
  Trash2
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const rootNavigationState = useRootNavigationState();
  const { nextPrayerName, nextPrayerTime, activePrayerName, timeRemaining, isLoading: isLoadingNext } = useNextPrayer();
  const { prayerData } = usePrayerTimes();
  
  const { lastRead } = useQuranStore();
  const { activities, addActivity, toggleActivity, removeActivity, checkAndResetDaily } = useActivityStore();

  React.useEffect(() => {
    checkAndResetDaily();
  }, []);

  if (!rootNavigationState?.key) return null;

  const completedActivities = activities.filter(a => a.completed).length;
  const progressPercent = activities.length > 0 ? Math.round((completedActivities / activities.length) * 100) : 0;

  const [modalVisible, setModalVisible] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');

  const handleAddActivity = () => {
    if (newActivityTitle.trim()) {
      addActivity(newActivityTitle.trim());
      setNewActivityTitle('');
      setModalVisible(false);
    }
  };

  const activePrayerColor = '#84583f'; // primary-600
  const inactivePrayerColor = '#a1a1aa'; // gray-400

  const getIconForPrayer = (name: string, isActive: boolean) => {
    const color = isActive ? activePrayerColor : inactivePrayerColor;
    switch (name) {
      case 'Fajr': return <Moon color={color} size={24} />;
      case 'Sunrise': return <Sunrise color={color} size={24} />;
      case 'Dhuhr': return <Sun color={color} size={24} />;
      case 'Asr': return <Sun color={color} size={24} />;
      case 'Maghrib': return <Sunset color={color} size={24} />;
      case 'Isha': return <MoonStar color={color} size={24} />;
      default: return <Sun color={color} size={24} />;
    }
  };

  const prayersList = prayerData ? [
    { name: 'Fajr', time: prayerData.timings.Fajr },
    { name: 'Sunrise', time: prayerData.timings.Sunrise },
    { name: 'Dhuhr', time: prayerData.timings.Dhuhr },
    { name: 'Asr', time: prayerData.timings.Asr },
    { name: 'Maghrib', time: prayerData.timings.Sunset },
    { name: 'Isha', time: prayerData.timings.Isha },
  ] : [];

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView className="flex-1 px-5 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="flex-row items-center justify-center mb-6">
          <View className="flex-row items-center">
            {/* <MoonStar size={24} color="#926247" fill="#926247" className="mr-2" /> */}
            <Image 
              source={require('@/assets/images/logo-jalanpulang.png')} 
              className="w-12 h-12 mr-2"
              resizeMode="contain"
            />
            <Text variant="h2" weight="bold" className="text-primary-900">
              JalanPulang
            </Text>
          </View>
        </View>

        {/* Next Prayer Card */}
        <View className="bg-[#fcecd9] rounded-[28px] p-6 mb-6 overflow-hidden relative border border-[#f5d9c3]">
          <View className="z-10 w-2/3">
            <Text variant="body" weight="medium" className="text-primary-800 dark:text-primary-800 mb-2">
              The Next Salah
            </Text>
            <Text variant="h1" weight="bold" className="text-primary-900 dark:text-primary-900 mb-1">
              {isLoadingNext ? '...' : nextPrayerTime} <Text variant="body" className="text-primary-700 dark:text-primary-700">GMT+7</Text>
            </Text>
            <Text variant="caption" className="text-primary-700 dark:text-primary-700">
              {nextPrayerName} is in {timeRemaining}
            </Text>
          </View>
          
          {/* Mosque Illustration */}
          <View className="absolute -right-4 -bottom-2 w-40 h-40 opacity-90 z-0">
            <Image 
              source={require('@/assets/images/mosque.png')} 
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Prayer Times Row */}
        <View className="flex-row justify-between items-center mb-8 px-1">
          {prayersList.map((prayer) => {
            const isActive = prayer.name === activePrayerName; 
            return (
              <View 
                key={prayer.name} 
                className={`items-center px-1.5 py-3 rounded-[20px] ${
                  isActive ? 'bg-primary-100 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800' : ''
                }`}
              >
                <Text variant="caption" weight={isActive ? 'bold' : 'medium'} className={`mb-2 ${isActive ? 'text-primary-800' : 'text-gray-400'}`} style={{ fontSize: 10 }}>
                  {prayer.name}
                </Text>
                <View className={`w-8 h-8 items-center justify-center rounded-full ${isActive ? 'bg-white dark:bg-primary-900/40' : ''}`}>
                  {getIconForPrayer(prayer.name, isActive)}
                </View>
                <Text variant="caption" weight={isActive ? 'bold' : 'medium'} className={`mt-2 ${isActive ? 'text-primary-900' : 'text-gray-500'}`}>
                  {prayer.time}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Quick Actions / Last Read */}
        <View className="flex-row space-x-4 gap-4 mb-8">
          {/* Last Read - Left Column */}
          <TouchableOpacity 
            onPress={() => lastRead && router.push(`/surah/${lastRead.surahNumber}?ayah=${lastRead.ayahNumber}`)}
            className="flex-1 bg-white dark:bg-surface-dark p-5 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center mr-2">
                <BookOpen size={16} color="#84583f" />
              </View>
              <Text variant="caption" weight="bold" className="text-primary-800">Last Read</Text>
            </View>
            
            {lastRead ? (
              <>
                <Text variant="body" weight="bold" className="text-primary-900 mb-1" numberOfLines={1}>
                  {lastRead.surahName}
                </Text>
                <Text variant="caption" className="text-gray-500">
                  Ayah {lastRead.ayahNumber}
                </Text>
              </>
            ) : (
              <Text variant="caption" className="text-gray-400 italic">No history yet</Text>
            )}
            
            <View className="absolute -right-2 -bottom-2 opacity-10">
              <BookOpen size={60} color="#84583f" />
            </View>
          </TouchableOpacity>

          {/* Right Column Actions */}
          <View className="flex-1 space-y-3 gap-3">
            <TouchableOpacity 
              onPress={() => router.push('/qibla')}
              className="flex-1 flex-row items-center bg-white dark:bg-surface-dark px-4 rounded-[20px] border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <View className="w-8 h-8 bg-orange-50 rounded-full items-center justify-center mr-3">
                <Compass size={18} color="#d97706" />
              </View>
              <Text variant="body" weight="semibold" className="text-primary-900">Qibla</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/donation')}
              className="flex-1 flex-row items-center bg-white dark:bg-surface-dark px-4 rounded-[20px] border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center mr-3">
                <Gift size={18} color="#059669" />
              </View>
              <Text variant="body" weight="semibold" className="text-primary-900">Donation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Activity */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text variant="h3" weight="semibold" className="text-primary-900 mb-1">
                Daily Activity
              </Text>
              <Text variant="caption" className="text-gray-500">
                You've completed {progressPercent}% of your goals
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
              className="flex-row items-center bg-primary-100 px-3 py-1.5 rounded-full"
            >
              <Plus size={16} color="#84583f" />
              <Text variant="caption" weight="bold" className="text-primary-700 ml-1">
                Add
              </Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View className="h-2 w-full bg-gray-100 rounded-full mb-6 overflow-hidden">
            <View 
              className="h-full bg-primary-500 rounded-full" 
              style={{ width: `${progressPercent}%` }} 
            />
          </View>
          {activities.map((activity) => (
            <ActivityItem 
              key={activity.id}
              id={activity.id}
              title={activity.title} 
              completed={activity.completed}
              onToggle={() => toggleActivity(activity.id)}
              onDelete={() => {
                Alert.alert("Delete", "Delete this activity?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: () => removeActivity(activity.id) }
                ]);
              }}
            />
          ))}
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={() => setModalVisible(false)}
              className="flex-1 justify-center items-center bg-black/50 px-6"
            >
              <TouchableOpacity 
                activeOpacity={1}
                className="bg-white dark:bg-surface-dark w-full p-8 rounded-[32px] shadow-xl"
              >
                <Text variant="h3" weight="bold" className="text-primary-900 mb-6">New Activity</Text>
                <TextInput
                  autoFocus
                  placeholder="What do you want to achieve today?"
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl mb-6 text-primary-900 dark:text-white"
                  value={newActivityTitle}
                  onChangeText={setNewActivityTitle}
                />
                <View className="flex-row justify-end space-x-3 gap-3">
                  <TouchableOpacity 
                    onPress={() => setModalVisible(false)}
                    className="px-6 py-3 rounded-full"
                  >
                    <Text weight="semibold" className="text-gray-500">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleAddActivity}
                    className="bg-primary-500 px-8 py-3 rounded-full shadow-sm"
                  >
                    <Text weight="bold" className="text-white">Add</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>

        <View className="h-10" />

      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureIcon({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress?: () => void }) {
  return (
    <View className="items-center">
      <TouchableOpacity 
        onPress={onPress}
        className="w-14 h-14 bg-primary-100 rounded-[18px] items-center justify-center mb-2"
      >
        {icon}
      </TouchableOpacity>
      <Text variant="caption" className="text-primary-800 dark:text-primary-800 font-medium">
        {label}
      </Text>
    </View>
  );
}

function ActivityItem({ id, title, completed, onToggle, onDelete }: { id: string, title: string, completed: boolean, onToggle: () => void, onDelete: () => void }) {
  return (
    <View className="flex-row items-center mb-3">
      <TouchableOpacity 
        onPress={onToggle}
        className={`flex-1 flex-row items-center justify-between p-4 rounded-[20px] border ${
          completed ? 'bg-primary-50/50 border-primary-100' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-800'
        } shadow-sm`}
      >
        <View className="flex-row items-center flex-1">
          <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${completed ? 'bg-primary-500' : 'bg-gray-50'}`}>
            {completed ? (
              <CheckCircle2 size={20} color="#ffffff" />
            ) : (
              <Circle size={20} color="#a1a1aa" />
            )}
          </View>
          <View className="flex-1">
            <Text 
              variant="body" 
              weight={completed ? 'medium' : 'semibold'} 
              className={`${completed ? 'text-gray-400 line-through' : 'text-primary-900'}`}
            >
              {title}
            </Text>
          </View>
        </View>
        {!completed && <ChevronRight size={18} color="#a1a1aa" />}
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onDelete}
        className="ml-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20"
      >
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}
