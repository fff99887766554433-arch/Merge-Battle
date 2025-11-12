import React from 'react';
import { useAudio } from '../context/AudioContext';

type Props = {
  className?: string;
  showIcons?: boolean;
};

export default function SoundSettings({ className = '', showIcons = true }: Props) {
  const { muted, volume, setMuted, setVolume } = useAudio();

  return (
    <div className={className}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {showIcons && <span>{muted ? '🔇' : '🔊'}</span>}
        <input
          aria-label="Sound volume"
          type="range"
          min={0}
          max={100}
          value={Math.round(volume * 100)}
          onChange={(e) => setVolume(Number(e.target.value) / 100)}
        />
        <button onClick={() => setMuted(!muted)} aria-label="Mute toggle">
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </div>
  );
}