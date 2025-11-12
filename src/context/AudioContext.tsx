import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import audioManager from '../audioManager';

type AudioContextType = {
  muted: boolean;
  volume: number; // 0..1
  setMuted: (v: boolean) => void;
  toggleMuted: () => void;
  setVolume: (v: number) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { audioManager.init(); } catch {}
    }
  }, []);

  useEffect(() => {
    try { audioManager.setMuted(muted); } catch {}
  }, [muted]);

  useEffect(() => {
    try { audioManager.setVolume(volume); } catch {}
  }, [volume]);

  const setMuted = (v: boolean) => setMutedState(v);
  const toggleMuted = () => setMutedState(s => !s);
  const setVolume = (v: number) => setVolumeState(Math.max(0, Math.min(1, v)));

  return (
    <AudioContext.Provider value={{ muted, volume, setMuted, toggleMuted, setVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};