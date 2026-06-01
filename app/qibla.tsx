import { Text } from '@/components/ui/Text';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { getQiblaDirection } from '@/services/prayerService';
import { usePrayerStore } from '@/store/usePrayerStore';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Navigation } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function QiblaScreen() {
  const router = useRouter();
  const { location, errorMsg } = usePrayerTimes();
  const { location: storeLocation } = usePrayerStore();
  const [heading, setHeading] = useState(0);
  const compassRotation = useSharedValue(0);

  // Fetch Qibla Direction from API
  const { data: qiblaData, isLoading: isLoadingQibla } = useQuery({
    queryKey: ['qibla', location?.coords?.latitude, location?.coords?.longitude],
    queryFn: () => getQiblaDirection(location?.coords?.latitude!, location?.coords?.longitude!),
    enabled: !!location?.coords?.latitude && !!location?.coords?.longitude,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchHeadingAsync((data) => {
        setHeading(data.trueHeading);
        // Rotate the compass rose so N always points North
        compassRotation.value = withSpring(-data.trueHeading, { damping: 15, stiffness: 80 });
      });
    };

    startWatching();

    return () => {
      subscription?.remove();
    };
  }, []);

  const animatedCompassStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${compassRotation.value}deg` }],
    };
  });

  const qiblaAngle = qiblaData?.direction || 0;

  return (
    <View className="flex-1 bg-[#e8a88a]">
      {/* Background Container - Using a solid color that matches the image's "peach/orange" but tailored to app tone */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#f2b599' }]} />
      
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1">
        {/* Header Area */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-white/20 rounded-full"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          
          <View className="items-center">
            <View className="flex-row items-center">
              <Navigation size={14} color="white" className="mr-1 rotate-45" />
              <Text variant="body" weight="medium" className="text-white text-base">
                {storeLocation.name}
              </Text>
            </View>
            <Text variant="h1" weight="bold" className="text-white text-3xl mt-1">
              {qiblaData ? `${Math.round(qiblaData.direction)}°` : '--°'}
            </Text>
          </View>
          <View className="w-10" />
        </View>

        <View className="flex-1 items-center justify-center">
          {!location || isLoadingQibla ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <View className="relative items-center justify-center">
              {/* Compass Outer Ring (Glow Effect) */}
              <View className="w-72 h-72 rounded-full bg-white/10 items-center justify-center">
                <View className="w-64 h-64 rounded-full bg-white/20 items-center justify-center">
                  
                  {/* Rotating Compass Rose */}
                  <Animated.View style={[styles.compassRose, animatedCompassStyle]}>
                    {/* Rose Background Image or SVG equivalent */}
                    <View className="w-full h-full rounded-full bg-white items-center justify-center border-4 border-primary-100 shadow-xl">
                      {/* Compass Markers */}
                      <View className="absolute top-2"><Text weight="bold" className="text-red-600 text-lg">N</Text></View>
                      <View className="absolute bottom-2"><Text weight="bold" className="text-gray-400 text-lg">S</Text></View>
                      <View className="absolute left-2"><Text weight="bold" className="text-gray-400 text-lg">W</Text></View>
                      <View className="absolute right-2"><Text weight="bold" className="text-gray-400 text-lg">E</Text></View>
                      
                      {/* Compass Rose Lines (Simulated) */}
                      <View className="w-0.5 h-full bg-gray-100 absolute" />
                      <View className="h-0.5 w-full bg-gray-100 absolute" />
                      <View className="w-0.5 h-full bg-gray-100 absolute rotate-45" />
                      <View className="w-0.5 h-full bg-gray-100 absolute -rotate-45" />

                      {/* Qibla Needle (Fixed relative to the rose) */}
                      <View 
                        className="absolute w-full h-full items-center" 
                        style={{ transform: [{ rotate: `${qiblaAngle}deg` }] }}
                      >
                        <View className="items-center">
                          {/* Kaaba Icon at the tip of the needle */}
                          <View className="w-8 h-8 bg-black rounded-sm items-center justify-center mt-6 shadow-md">
                            <View className="w-full h-1 bg-yellow-500 absolute top-1" />
                            <View className="w-1 h-1 bg-yellow-400 rounded-full" />
                          </View>
                          <View className="w-1.5 bg-gray-900 h-16 -mt-1 rounded-full" />
                        </View>
                      </View>

                      {/* North Needle (Red - points to N) */}
                      <View className="absolute w-full h-full items-center">
                        <View className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[40px] border-b-red-600 mt-10" />
                        <View className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[40px] border-t-gray-300" />
                      </View>

                      {/* Center Hub */}
                      <View className="w-6 h-6 bg-white rounded-full border-4 border-gray-800 z-50 shadow-sm" />
                    </View>
                  </Animated.View>

                </View>
              </View>
            </View>
          )}
        </View>

        {/* Bottom Mosque Silhouette Decoration */}
        <View className="absolute bottom-0 w-full h-1/4">
          <Image 
            source={require('@/assets/images/shilluet-mosque.png')} 
            className="w-full h-full opacity-40"
            style={{ tintColor: '#462f21' }}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  compassRose: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
