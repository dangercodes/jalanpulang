import { Text } from '@/components/ui/Text';
import { useSettingsStore } from '@/store/useSettingsStore';
import { router } from 'expo-router';
import {
  Bell,
  ChevronRight,
  Compass,
  Heart,
  Info,
  Languages,
  MoonStar,
  Star,
  Type
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, Switch, TouchableOpacity, View, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { 
    arabicFontSize, 
    notificationsEnabled, 
    language,
    setNotificationsEnabled,
    setArabicFontSize 
  } = useSettingsStore();

  const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);

  const isDarkMode = colorScheme === 'dark';
  const toggleDarkMode = () => {
    setColorScheme(isDarkMode ? 'light' : 'dark');
  };

  const iconColor = '#926247'; // brown primary

  const handleRateApp = () => {
    Alert.alert("Rate App", "Redirecting to Play Store...");
  };

  const handleShareApp = async () => {
    try {
      await Linking.openURL('https://quranova.com');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView className="flex-1 px-5 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        <Text variant="h1" weight="bold" className="text-primary-900 mb-8 mt-2">
          Settings
        </Text>

        {/* Appearance Section */}
        <SettingsGroup title="Appearance">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl items-center justify-center mr-4">
                <MoonStar size={22} color={iconColor} />
              </View>
              <Text variant="body" weight="medium" className="text-primary-900">Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: '#eaddd7', true: '#926247' }}
              thumbColor={'#ffffff'}
              onValueChange={toggleDarkMode}
              value={isDarkMode}
            />
          </View>
          
          <SettingsItem 
            icon={<Languages size={22} color={iconColor} />} 
            label="App Language" 
            value={language === 'id' ? 'Bahasa Indonesia' : 'English'}
          />
        </SettingsGroup>

        {/* Quran & Prayer Section */}
        <SettingsGroup title="Quran & Prayer">
          <SettingsItem 
            icon={<Type size={22} color={iconColor} />} 
            label="Arabic Font Size" 
            value={`${arabicFontSize}px`}
            onPress={() => setFontSizeModalVisible(true)}
          />
          <SettingsItem 
            icon={<Compass size={22} color={iconColor} />} 
            label="Prayer Calculation" 
            value="MWL (Standard)"
          />
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl items-center justify-center mr-4">
                <Bell size={22} color={iconColor} />
              </View>
              <Text variant="body" weight="medium" className="text-primary-900">Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: '#eaddd7', true: '#926247' }}
              thumbColor={'#ffffff'}
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
        </SettingsGroup>

        {/* Support & About Section */}
        <SettingsGroup title="Support">
          <SettingsItem 
            icon={<Heart size={22} color={iconColor} />} 
            label="Donation to Developer" 
            onPress={() => router.push('/donation')}
          />
          <SettingsItem 
            icon={<Star size={22} color={iconColor} />} 
            label="Rate JalanPulang" 
            onPress={handleRateApp}
          />
          {/* <SettingsItem 
            icon={<Share2 size={22} color={iconColor} />} 
            label="Share with Friends" 
            onPress={handleShareApp}
          /> */}
          <SettingsItem 
            icon={<Info size={22} color={iconColor} />} 
            label="About JalanPulang" 
            value="v1.0.0"
            border={false}
          />
        </SettingsGroup>

        <View className="items-center mt-4 mb-10">
          <Text variant="caption" className="text-gray-400">Made with ❤️ for the Ummah</Text>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={fontSizeModalVisible}
        onRequestClose={() => setFontSizeModalVisible(false)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setFontSizeModalVisible(false)}
          className="flex-1 justify-center items-center bg-black/50 px-6"
        >
          <TouchableOpacity 
            activeOpacity={1}
            className="bg-white dark:bg-surface-dark w-full p-8 rounded-[32px] shadow-xl"
          >
            <Text variant="h3" weight="bold" className="text-primary-900 mb-6">Arabic Font Size</Text>
            
            <View className="items-center mb-8">
              <Text variant="arabic" style={{ fontSize: arabicFontSize, lineHeight: arabicFontSize * 1.8 }}>
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </Text>
              <Text variant="caption" className="mt-4">Preview Text</Text>
            </View>

            <View className="flex-row items-center justify-between mb-8 px-4">
              <TouchableOpacity 
                onPress={() => setArabicFontSize(Math.max(16, arabicFontSize - 2))}
                className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center"
              >
                <Text weight="bold" className="text-primary-700 text-xl">-</Text>
              </TouchableOpacity>
              
              <Text variant="h2" weight="bold" className="text-primary-900">
                {arabicFontSize}
              </Text>

              <TouchableOpacity 
                onPress={() => setArabicFontSize(Math.min(48, arabicFontSize + 2))}
                className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center"
              >
                <Text weight="bold" className="text-primary-700 text-xl">+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => setFontSizeModalVisible(false)}
              className="bg-primary-500 w-full py-4 rounded-2xl shadow-sm"
            >
              <Text weight="bold" className="text-white text-center">Done</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <View className="h-10" />
    </SafeAreaView>
  );
}

function SettingsGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <View className="mb-8">
      <Text variant="caption" weight="bold" className="text-primary-800 ml-2 mb-3 uppercase tracking-widest">
        {title}
      </Text>
      <View className="bg-white dark:bg-surface-dark rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {children}
      </View>
    </View>
  );
}

function SettingsItem({ 
  icon, 
  label, 
  value, 
  onPress, 
  border = true 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value?: string, 
  onPress?: () => void, 
  border?: boolean 
}) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center justify-between p-4 ${border ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl items-center justify-center mr-4">
          {icon}
        </View>
        <View className="flex-1">
          <Text variant="body" weight="medium" className="text-primary-900">{label}</Text>
          {value && (
            <Text variant="caption" className="text-gray-500 mt-0.5">{value}</Text>
          )}
        </View>
      </View>
      <ChevronRight size={18} color="#a1a1aa" />
    </TouchableOpacity>
  );
}
