import { getPrayerTimesByLocation } from '@/services/prayerService';
import { usePrayerStore } from '@/store/usePrayerStore';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';

export function usePrayerTimes() {
  const { location: storeLocation } = usePrayerStore();
  
  const { data: gpsLocation, error: gpsError, refetch: refetchGPS, isRefetching: isRefetchingGPS } = useQuery({
    queryKey: ['gpsLocation'],
    queryFn: async () => {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        // If not granted, we MUST delay the prompt to avoid interrupting Expo Router's screen mount transition
        await new Promise(resolve => setTimeout(resolve, 1500));
        let req = await Location.requestForegroundPermissionsAsync();
        if (req.status !== 'granted') {
          throw new Error('Permission to access location was denied');
        }
      }

      // Try to get cached/last known position first for instant loading and battery saving
      // Skip cache if we are manually refetching
      let loc = null;
      if (!isRefetchingGPS) {
        loc = await Location.getLastKnownPositionAsync({});
      }
      
      if (!loc) {
        // Fallback to getting current position if no last known position
        // Use low accuracy for prayer times to save battery
        loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }
      return {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
    },
    enabled: storeLocation.useGPS,
    staleTime: 1000 * 60 * 30, // Cache GPS location for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in garbage collection for 1 hour
  });

  const activeLat = storeLocation.useGPS ? gpsLocation?.latitude : storeLocation.latitude;
  const activeLng = storeLocation.useGPS ? gpsLocation?.longitude : storeLocation.longitude;

  const { data: address, refetch: refetchAddress } = useQuery({
    queryKey: ['locationAddress', activeLat, activeLng],
    queryFn: async () => {
      if (!activeLat || !activeLng) return null;
      const [result] = await Location.reverseGeocodeAsync({
        latitude: activeLat,
        longitude: activeLng,
      });
      return result ? `${result.city || result.region || result.name}` : null;
    },
    enabled: !!activeLat && !!activeLng,
    staleTime: 1000 * 60 * 60 * 24, // Address doesn't change often
  });

  const { data: prayerData, isLoading: isPrayerLoading, refetch: refetchPrayer, isRefetching: isRefetchingPrayer } = useQuery({
    queryKey: ['prayerTimes', activeLat, activeLng],
    queryFn: () => getPrayerTimesByLocation(activeLat!, activeLng!),
    enabled: !!activeLat && !!activeLng,
    staleTime: 1000 * 60 * 60 * 6, // Cache prayer times for 6 hours
    gcTime: 1000 * 60 * 60 * 24, // Keep for 24 hours
  });

  const refresh = async () => {
    if (storeLocation.useGPS) {
      await refetchGPS();
    }
    await refetchAddress();
    await refetchPrayer();
  };

  const isLoading = storeLocation.useGPS ? (!gpsLocation || isPrayerLoading) : isPrayerLoading;
  const isRefreshing = isRefetchingGPS || isRefetchingPrayer;
  const errorMsg = gpsError ? (gpsError as Error).message : null;

  return { 
    location: storeLocation.useGPS ? (gpsLocation ? { coords: gpsLocation } : null) : { coords: { latitude: storeLocation.latitude, longitude: storeLocation.longitude } }, 
    prayerData, 
    address,
    isLoading, 
    isRefreshing,
    refresh,
    errorMsg 
  };
}
