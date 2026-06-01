import { Text } from '@/components/ui/Text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { ChevronLeft, Code, Coffee, Copy, Heart, Server } from 'lucide-react-native';
import React from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DonationScreen() {
  const colorScheme = useColorScheme();

  const handleCopy = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", `${label} has been copied to clipboard.`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2">
          <ChevronLeft size={24} color={colorScheme === 'dark' ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
        <Text variant="h3" weight="bold">Support JalanPulang</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        {/* Hero Section */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Heart size={40} color="#84583f" fill="#84583f" />
          </View>
          <Text variant="h2" weight="bold" className="text-center text-primary-900 mb-2">
            Sadaqah Jariyah
          </Text>
          <Text variant="body" className="text-center text-gray-500 leading-6">
            Your support helps me maintain the servers, develop new features, and keep JalanPulang free for everyone without ads.
          </Text>
        </View>

        {/* QRIS Section */}
        <View className="bg-white dark:bg-surface-dark rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-6 items-center">
          <Text variant="body" weight="bold" className="text-primary-900 mb-4">Scan QRIS for Donation</Text>
          <Image 
            source={require('../assets/images/qris_donation.jpg')} 
            className="w-64 h-80 rounded-2xl mb-4"
            resizeMode="contain"
          />
          <Text variant="caption" className="text-gray-400 text-center">
            Supports GoPay, OVO, Dana, LinkAja, and all Indonesian Banks.
          </Text>
        </View>

        {/* Bank Details */}
        <View className="mb-8">
          <Text variant="body" weight="bold" className="text-primary-900 mb-4 ml-2">Bank Transfer</Text>
          
          <TouchableOpacity 
            onPress={() => handleCopy("1234567890", "Bank Central Asia (BCA)")}
            className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex-row items-center justify-between mb-3"
          >
            <View>
              <Text variant="caption" weight="bold" className="text-primary-700 mb-1">Bank Central Asia (BCA)</Text>
              <Text variant="body" weight="bold" className="text-primary-900">1234 567 890</Text>
              <Text variant="caption" className="text-gray-500">a.n. Admin JalanPulang</Text>
            </View>
            <Copy size={20} color="#926247" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleCopy("admin@jalanpulang.com", "PayPal")}
            className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex-row items-center justify-between"
          >
            <View>
              <Text variant="caption" weight="bold" className="text-primary-700 mb-1">PayPal / Global Support</Text>
              <Text variant="body" weight="bold" className="text-primary-900">admin@jalanpulang.com</Text>
            </View>
            <Copy size={20} color="#926247" />
          </TouchableOpacity>
        </View>

        {/* Use of Funds */}
        <View className="bg-primary-50 dark:bg-primary-900/10 rounded-[24px] p-6 mb-10">
          <Text variant="body" weight="bold" className="text-primary-900 mb-4">Donations go towards:</Text>
          
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-white dark:bg-surface-dark rounded-xl items-center justify-center mr-4">
              <Server size={20} color="#84583f" />
            </View>
            <Text variant="caption" className="text-primary-800 flex-1">Server & API maintenance costs</Text>
          </View>

          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-white dark:bg-surface-dark rounded-xl items-center justify-center mr-4">
              <Code size={20} color="#84583f" />
            </View>
            <Text variant="caption" className="text-primary-800 flex-1">Adding more features & content</Text>
          </View>

          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-white dark:bg-surface-dark rounded-xl items-center justify-center mr-4">
              <Coffee size={20} color="#84583f" />
            </View>
            <Text variant="caption" className="text-primary-800 flex-1">Caffeine for the developer</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
