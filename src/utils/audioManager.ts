// src/utils/audioManager.ts

type AudioEffectName = 'click' | 'merge' | 'win' | 'lose' | 'background';

class AudioManager {
  private effects: Record<string, HTMLAudioElement> = {};
  private backgroundMusic: HTMLAudioElement | null = null;

  // Загружаем звуки
  preloadEffects() {
    const sounds: Record<AudioEffectName, string> = {
      click: '/audio/click.mp3',
      merge: '/audio/merge.mp3',
      win: '/audio/win.mp3',
      lose: '/audio/lose.mp3',
      background: '/audio/background.mp3',
    };

    for (const [name, src] of Object.entries(sounds)) {
      const audio = new Audio(src);
      audio.load();
      this.effects[name] = audio;
    }
  }

  // Воспроизводим эффект
  playEffect(name: AudioEffectName) {
    const effect = this.effects[name];
    if (effect) {
      effect.currentTime = 0;
      effect.play().catch(() => {});
    }
  }

  // Фоновая музыка
  playBackground() {
    if (!this.backgroundMusic) {
      this.backgroundMusic = new Audio('/audio/background.mp3');
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3;
    }
    this.backgroundMusic.play().catch(() => {});
  }

  stopBackground() {
    if (this.backgroundMusic) this.backgroundMusic.pause();
  }
}

export const audioManager = new AudioManager();
