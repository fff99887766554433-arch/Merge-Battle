import audioManager from "./audioManager";

// Инициализация audioManager: preload всех эффектов и разблокировка аудио по первому пользовательскому действию.
export function initAudioApp(options?: { poolSize?: number; autoplayBg?: boolean }) {
  const poolSize = options?.poolSize ?? 4;
  const autoplayBg = options?.autoplayBg ?? true;

  try {
    audioManager.preloadAll(poolSize);
  } catch (e) {
    console.warn("[audioInit] preloadAll failed", e);
  }

  const unlockOnce = async () => {
    try {
      await audioManager.unlock();
      if (autoplayBg) {
        await audioManager.ensureUnlockedAndResume();
      }
    } catch (err) {
      console.warn("[audioInit] unlock error", err);
    } finally {
      document.removeEventListener("click", unlockOnce);
      document.removeEventListener("touchstart", unlockOnce);
    }
  };

  document.addEventListener("click", unlockOnce, { once: true });
  document.addEventListener("touchstart", unlockOnce, { once: true });

  return {
    preload: () => audioManager.preloadAll(poolSize),
    playEffect: (key: string, opt?: { volume?: number }) => audioManager.playEffect(key, opt),
    playBg: (url?: string) => audioManager.playBackgroundMusic(url),
    toggleMusic: () => audioManager.toggleMusic(),
    toggleEffects: () => audioManager.toggleEffects(),
    setBgVolume: (v: number) => audioManager.setBgVolume(v),
    setEffectsVolume: (v: number) => audioManager.setEffectsVolume(v)
  };
}