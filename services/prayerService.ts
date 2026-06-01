import { prayerApi } from './api';
import { format } from 'date-fns';

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface PrayerData {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    hijri: {
      date: string;
      format: string;
      day: string;
      weekday: {
        en: string;
        ar: string;
      };
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export const getPrayerTimesByLocation = async (lat: number, lng: number): Promise<PrayerData> => {
  const date = format(new Date(), 'dd-MM-yyyy');
  const { data } = await prayerApi.get<{ code: number; status: string; data: PrayerData }>(
    `/timings/${date}?latitude=${lat}&longitude=${lng}&method=2`
  );
  return data.data;
};

export interface QiblaData {
  direction: number;
  latitude: number;
  longitude: number;
}

export const getQiblaDirection = async (lat: number, lng: number): Promise<QiblaData> => {
  const { data } = await prayerApi.get<{ code: number; status: string; data: QiblaData }>(
    `/qibla/${lat}/${lng}`
  );
  return data.data;
};
