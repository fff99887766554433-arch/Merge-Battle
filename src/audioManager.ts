// src/audioManager.ts
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

  // pools by key (key corresponds to logical sound key, e.g. 'click', 'merge', 'coin')
  private pools: Map<string, PoolItem[]> = new Map();
  private poolSize = 4; // default per sound

  // mapping key -> url (populate from gameConfig.sound where possible)
  private map: Record<string, string> = {};

  private storageKey = "merge_battle_audio_settings_v1";

  constructor() {
    // build default map from gameConfig if present
    const s: any = (gameConfig as any).sound ?? {};
    // Try common keys; adapt if your config uses different names
    this.map = {
      click: s.click ?? s.buttonClick ?? "/audio/ui_click.mp3",
      merge: s.mergeBlock ?? s.tileMerge ?? "/audio/merge.mp3",
      spawn: s.spawn ?? "/audio/spawn.mp3",
      purchase: s.purchase ?? "/audio/purchase.mp3",
      coin: s.coin ?? "/audio/coin.mp3",
      bgm: s.bgMusic ?? "/audio/bgmusic.mp3",
      win: s.win ?? "/audio/win.mp3",
      error: s.error ?? "/audio/error.mp3"
    };
    // load settings
    this.loadSettings();
    // visibility handling (pause music on hidden)
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.pauseBackgroundMusic();
        else this.resumeBackgroundMusic();
      });
    }
    console.log("[audioManager] constructed");
  }

  // Try to create/resume AudioContext on first user gesture.
  // Call this from a click/tap handler in UI (e.g. on first screen press).
  public async unlock() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.audioCtx.state === "suspended") {
        await this.audioCtx.resume();
      }
      this.unlocked = true;
      // create very short silent buffer to satisfy some mobile browsers
      try {
        const ctx = this.audioCtx;
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

  // Preload a single sound key (creates pool)
  public preload(key: string, url?: string, poolSize?: number) {
    const u = url ?? this.map[key];
    if (!u) return;
    const size = poolSize ?? this.poolSize;
    const arr: PoolItem[] = [];
    for (let i = 0; i < size; i++) {
      const a = new Audio(u);
      a.preload = "auto";
      // ensure crossOrigin if required: a.crossOrigin = "anonymous";
      // attach handler to free pool slot on end
      a.addEventListener("ended", () => {
        const item = arr.find(it => it.el === a);
        if (item) item.busy = false;
      });
      arr.push({ el: a, busy: false });
    }
    this.pools.set(key, arr);
    // warm request by loading first element
    if (arr[0]) {
      arr[0].el.load();
    }
  }

  // Preload all keys found in map
  public preloadAll(poolSize?: number) {
    Object.keys(this.map).forEach(k => {
      this.preload(k, this.map[k], poolSize);
    });
  }

  // Play an effect (non-looping). Key must be preloaded or map must contain url.
  public playEffect(key: string, options?: { volume?: number }) {
    try {
      if (!this.effectsEnabled) return;
      const pool = this.pools.get(key);
      if (pool && pool.length > 0) {
        // find free
        const free = pool.find(p => !p.busy && p.el.paused);
        const item = free ?? pool[0]; // reuse first if all busy
        item.busy = true;
        const el = item.el;
        el.volume = options?.volume ?? 0.8;
        el.currentTime = 0;
        el.play().catch(() => {
          item.busy = false;
        });
        return;
      }
      // fallback: direct play from mapped url
      const u = this.map[key];
      if (!u) return;
      const a = new Audio(u);
      a.volume = options?.volume ?? 0.8;
      a.play().catch(() => {});
    } catch (err) {
      console.warn("[audioManager] playEffect error", err);
    }
  }

  // Play single background music (looping). url optional (uses map.bgm)
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
      // try to autoplay; if blocked, it's fine — resume after unlock called
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
    } catch (err) {}
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

  // Toggleters
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
    // set default volume for pools
    const vol = Math.max(0, Math.min(1, v));
    this.pools.forEach(pool => {
      pool.forEach(item => (item.el.volume = vol));
    });
    this.saveSettings();
  }

  // Ensure bg resumes after unlock if autoplay previously blocked
  public async ensureUnlockedAndResume() {
    if (!this.unlocked) {
      await this.unlock();
    }
    if (this.bgEl && this.bgEl.paused && this.musicEnabled) {
      this.bgEl.play().catch(() => {});
    }
  }

  // settings persistence
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