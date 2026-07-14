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
    if (config.soundscape && config.soundscape !== 'none') {
      const baseUrl = import.meta.env.BASE_URL || '/';
      src = `${baseUrl}assets/${config.soundscape}.mp3`;
    }

    if (src && audio.src !== src) {
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
