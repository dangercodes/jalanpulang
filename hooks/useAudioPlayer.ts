import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);

  async function playSound(url: string, ayahNumber: number, onFinished?: () => void) {
    if (sound) {
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      setCurrentPlayingAyah(ayahNumber);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          setCurrentPlayingAyah(null);
          if (onFinished) onFinished();
        }
      });
    } catch (error) {
      console.log('Error playing audio', error);
      setIsPlaying(false);
      setCurrentPlayingAyah(null);
    }
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setCurrentPlayingAyah(null);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return { playSound, stopSound, isPlaying, currentPlayingAyah };
}
