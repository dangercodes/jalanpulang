import { useState, useEffect } from 'react';
import { usePrayerTimes } from './usePrayerTimes';

export function useNextPrayer() {
  const { prayerData, isLoading, errorMsg } = usePrayerTimes();
  const [nextPrayerName, setNextPrayerName] = useState<string>('...');
  const [nextPrayerTime, setNextPrayerTime] = useState<string>('...');
  const [activePrayerName, setActivePrayerName] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('...');

  useEffect(() => {
    if (!prayerData) return;

    const timings = prayerData.timings;
    const prayers = [
      { name: 'Fajr', time: timings.Fajr },
      { name: 'Sunrise', time: timings.Sunrise },
      { name: 'Dhuhr', time: timings.Dhuhr },
      { name: 'Asr', time: timings.Asr },
      { name: 'Maghrib', time: timings.Sunset },
      { name: 'Isha', time: timings.Isha },
    ];

    const getMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const calculateNextAndActive = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      // Calculate Next Prayer
      let nextP = prayers[0];
      let foundNext = false;
      let targetTime = new Date();

      for (let p of prayers) {
        const [hours, minutes] = p.time.split(':').map(Number);
        targetTime = new Date();
        targetTime.setHours(hours, minutes, 0, 0);

        if (targetTime > now) {
          nextP = p;
          foundNext = true;
          break;
        }
      }

      if (!foundNext) {
        nextP = prayers[0];
        const [hours, minutes] = nextP.time.split(':').map(Number);
        targetTime = new Date();
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(hours, minutes, 0, 0);
      }

      setNextPrayerName(nextP.name);
      setNextPrayerTime(nextP.time);

      const diff = targetTime.getTime() - now.getTime();
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeRemaining(
        `-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );

      // Calculate Active Prayer
      let active = prayers[0].name;
      for (const prayer of prayers) {
        if (currentMinutes >= getMinutes(prayer.time)) {
          active = prayer.name;
        } else {
          break;
        }
      }

      if (currentMinutes < getMinutes(prayers[0].time)) {
        active = 'Isha';
      }
      
      setActivePrayerName(active);
    };

    calculateNextAndActive();
    const interval = setInterval(calculateNextAndActive, 1000);

    return () => clearInterval(interval);
  }, [prayerData]);

  return { nextPrayerName, nextPrayerTime, activePrayerName, timeRemaining, isLoading, errorMsg };
}
