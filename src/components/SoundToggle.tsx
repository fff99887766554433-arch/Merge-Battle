import React from 'react';
import { useAudio } from '../context/AudioContext';

type Props = {
  className?: string;
  ariaLabel?: string;
};

export default function SoundToggle({ className = '', ariaLabel = 'Toggle sound' }: Props) {
  const { muted, toggleMuted } = useAudio();
  return (
    <button
      type="button"
      aria-pressed={muted}
      aria-label={ariaLabel}
      className={className}
      onClick={toggleMuted}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}