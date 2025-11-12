// Улучшенный audioManager — preloading, pools, unlock via user gesture, volumes, toggles.
// Включает маппинг всех звуков из public/audio (achievementUnlock, battleLose, ...).

import { gameConfig } from "./gameConfig";

type PoolItem = {
  el: HTMLAudioElement;
  busy: boolean;
};

class AudioManager {
  private audioCtx: AudioContext | null = null;
  private unlocked = false;

  private bgEl: HTMLAudioElement | null = null;
  private bgVolume = 0.5;

  private effectsEnabled = true;
  private musicEnabled = true;

  private pools: Map<string, PoolItem[]> = new Map();
  private poolSize = 4;

  private map: Record<string, string> = {};

  private storageKey = "merge_battle_audio_settings_v1";

  constructor() {
    const s: any = (gameConfig as any).sound ?? {};

    // Полный маппинг под ваши имена файлов в public/audio
    this.map = {
      achievementUnlock: s.achievementUnlock ?? "/audio/achievementUnlock.mp3",
      battleLose: s.battleLose ?? "/audio/battleLose.mp3",
      battleWin: s.battleWin ?? "/audio/battleWin.mp3",
      buttonClick: s.click ?? s.buttonClick ?? "/audio/buttonClick.mp3",
      coin: s.coin ?? "/audio/coin.mp3",
      levelUp: s.levelUp ?? "/audio/levelUp.mp3",
      menuClose: s.menuClose ?? "/audio/menuClose.mp3",
      menuOpen: s.menuOpen ?? "/audio/menuOpen.mp3",
      mergeEpic: s.mergeEpic ?? "/audio/mergeEpic.mp3",
      rewardClaim: s.rewardClaim ?? "/audio/rewardClaim.mp3",
      tileMerge: s.tileMerge ?? "/audio/tileMerge.mp3",
      // bg music and a few aliases
      bgm: s.bgMusic ?? "/audio/bgmusic.mp3",
      win: s.win ?? "/audio/win.mp3",
      error: s.error ?? "/audio/error.mp3",
      spawn: s.spawn ?? "/audio/spawn.mp3",
      purchase: s.purchase ?? "/audio/purchase.mp3"
    };

    this.loadSettings();

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.pauseBackgroundMusic();
        else this.resumeBackgroundMusic();
      });
    }
    console.log("[audioManager] constructed");
  }

  public async unlock() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.audioCtx.state === "suspended") {
        await this.audioCtx.resume();
      }
      this.unlocked = true;
      try {
        const ctx = this.audioCtx!;
        const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(ctx.destination);
        src.start(0);
      } catch {}
      console.log("[audioManager] unlocked audio context");
      return true;
    } catch (err) {
      console.warn("[audioManager] unlock failed", err);
      return false;
    }
  }

  public preload(key: string, url?: string, poolSize?: number) {
    const u = url ?? this.map[key];
    if (!u) return;
    const size = poolSize ?? this.poolSize;
    const arr: PoolItem[] = [];
    for (let i = 0; i < size; i++) {
      const a = new Audio(u);
      a.preload = "auto";
      a.addEventListener("ended", () => {
        const item = arr.find(it => it.el === a);
        if (item) item.busy = false;
      });
      arr.push({ el: a, busy: false });
    }
    this.pools.set(key, arr);
    if (arr[0]) arr[0].el.load();
  }

  public preloadAll(poolSize?: number) {
    Object.keys(this.map).forEach(k => {
      this.preload(k, this.map[k], poolSize);
    });
  }

  public playEffect(key: string, options?: { volume?: number }) {
    try {
      if (!this.effectsEnabled) return;
      const pool = this.pools.get(key);
      if (pool && pool.length > 0) {
        const free = pool.find(p => !p.busy && p.el.paused);
        const item = free ?? pool[0];
        item.busy = true;
        const el = item.el;
        el.volume = options?.volume ?? 0.8;
        el.currentTime = 0;
        el.play().catch(() => {
          item.busy = false;
        });
        return;
      }
      const u = this.map[key];
      if (!u) return;
      const a = new Audio(u);
      a.volume = options?.volume ?? 0.8;
      a.play().catch(() => {});
    } catch (err) {
      console.warn("[audioManager] playEffect error", err);
    }
  }

  public playBackgroundMusic(url?: string, loop = true) {
    if (!this.musicEnabled) return;
    const u = url ?? this.map["bgm"];
    if (!u) return;
    try {
      if (this.bgEl) {
        this.bgEl.pause();
        this.bgEl = null;
      }
      const a = new Audio(u);
      a.loop = loop;
      a.volume = this.bgVolume;
      a.play().catch(() => {});
      this.bgEl = a;
    } catch (err) {
      console.warn("[audioManager] playBackgroundMusic failed", err);
    }
  }

  public stopBackgroundMusic() {
    try {
      if (this.bgEl) {
        this.bgEl.pause();
        this.bgEl.currentTime = 0;
        this.bgEl = null;
      }
    } catch {}
  }

  public pauseBackgroundMusic() {
    try {
      if (this.bgEl && !this.bgEl.paused) this.bgEl.pause();
    } catch {}
  }

  public resumeBackgroundMusic() {
    try {
      if (this.bgEl && this.musicEnabled) this.bgEl.play().catch(() => {});
    } catch {}
  }

  public toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) this.stopBackgroundMusic();
    else this.resumeBackgroundMusic();
    this.saveSettings();
    return this.musicEnabled;
  }
  public toggleEffects() {
    this.effectsEnabled = !this.effectsEnabled;
    this.saveSettings();
    return this.effectsEnabled;
  }

  public setBgVolume(v: number) {
    this.bgVolume = Math.max(0, Math.min(1, v));
    if (this.bgEl) this.bgEl.volume = this.bgVolume;
    this.saveSettings();
  }

  public setEffectsVolume(v: number) {
    const vol = Math.max(0, Math.min(1, v));
    this.pools.forEach(pool => {
      pool.forEach(item => (item.el.volume = vol));
    });
    this.saveSettings();
  }

  public async ensureUnlockedAndResume() {
    if (!this.unlocked) {
      await this.unlock();
    }
    if (this.bgEl && this.bgEl.paused && this.musicEnabled) {
      this.bgEl.play().catch(() => {});
    }
  }

  private loadSettings() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const s = JSON.parse(raw);
      this.effectsEnabled = s.effectsEnabled ?? this.effectsEnabled;
      this.musicEnabled = s.musicEnabled ?? this.musicEnabled;
      this.bgVolume = s.bgVolume ?? this.bgVolume;
    } catch {}
  }
  private saveSettings() {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          effectsEnabled: this.effectsEnabled,
          musicEnabled: this.musicEnabled,
          bgVolume: this.bgVolume
        })
      );
    } catch {}
  }
}

const audioManager = new AudioManager();
export default audioManager;
export { audioManager };