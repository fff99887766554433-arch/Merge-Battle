// src/audioManager.ts
import { gameConfig } from "./gameConfig";

class AudioManager {
  private backgroundMusic: HTMLAudioElement | null = null;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private effectsEnabled = true;
  private musicEnabled = true;

  constructor() {
    console.log("[audioManager] Created");
  }

  init() {
    console.log("[audioManager] Initialized");
  }

  /** Предзагрузка эффектов */
  preloadEffects() {
    console.log("[audioManager] Effects preloaded");
  }

  /** Предзагрузка отдельного звука */
  preloadSound(url: string) {
    if (!url) return;
    const audio = new Audio(url);
    audio.preload = "auto";
    this.sounds.set(url, audio);
  }

  /** Проигрывание фоновой музыки */
  playBackgroundMusic(url: string, loop = true) {
    if (!this.musicEnabled) return;

    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    }

    const audio = new Audio(url);
    audio.loop = loop;
    audio.volume = 0.5;

    audio.play().catch(err => {
      console.warn("[audioManager] Autoplay prevented:", err);
    });

    this.backgroundMusic = audio;
    console.log("[audioManager] Background music playing:", url);
  }

  /** ✅ Альяс для совместимости */
  playMusic(url: string, loop = true) {
    this.playBackgroundMusic(url, loop);
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic = null;
      console.log("[audioManager] Background music stopped");
    }
  }

  /** Проигрывание эффекта */
  playEffect(url: string) {
    if (!this.effectsEnabled) return;
    const base = this.sounds.get(url) ?? new Audio(url);
    const sound = base.cloneNode(true) as HTMLAudioElement;
    sound.volume = 0.8;
    sound.play().catch(() => {});
  }

  /** Переключение музыки */
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) this.stopBackgroundMusic();
    return this.musicEnabled;
  }

  /** Переключение эффектов */
  toggleEffects() {
    this.effectsEnabled = !this.effectsEnabled;
    return this.effectsEnabled;
  }
}

export const audioManager = new AudioManager();
export default audioManager; // ✅ экспорт по умолчанию
