import React, { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSession } from '../contexts/SessionContext';

export const SoundscapeManager = () => {
  const { config } = useSettings();
  const { isPlaying } = useSession();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    
    // Set volume
    audio.volume = config.volume;

    // Set track
    let src = '';
    switch (config.soundscape) {
      case 'rain': src = 'assets/rain.wav'; break;
      case 'whitenoise': src = 'assets/whitenoise.wav'; break;
      case 'ocean': src = 'assets/ocean.mp3'; break;
      default: src = ''; break;
    }

    if (src && audio.src !== src) {
      // In a real app we would want absolute paths or imported assets
      audio.src = src;
    }

    if (isPlaying && src) {
      audio.play().catch(e => console.error("Autoplay blocked:", e));
    } else {
      audio.pause();
    }
  }, [config.soundscape, config.volume, isPlaying]);

  return null; // This component does not render any visible UI
};
