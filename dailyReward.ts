import { gameConfig } from "./gameConfig";
import { getPlayerData, updatePlayerData } from "./economy";

const STORAGE_KEY = "merge_battle_daily_v2";
const UZ_OFFSET_MS = 5 * 60 * 60 * 1000; // Uzbekistan +5 UTC (нет DST)

type DailyState = {
  lastClaimDateUz?: string; // YYYY-MM-DD (по UZ)
  streak?: number; // 0..7
  rewards?: number[]; // текущая неделя (7 значений)
  rotationSeed?: number; // для детерминированной ротации (можно увеличить)
};

function readState(): DailyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { lastClaimDateUz: undefined, streak: 0, rewards: generateWeeklyRewards(), rotationSeed: Date.now() };
    }
    return JSON.parse(raw) as DailyState;
  } catch {
    return { lastClaimDateUz: undefined, streak: 0, rewards: generateWeeklyRewards(), rotationSeed: Date.now() };
  }
}
function writeState(s: DailyState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}
function getUzDate(ts = Date.now()): Date {
  // Compute Uzbekistan-local Date object using fixed +5 offset
  const utc = new Date(ts);
  const uzTs = utc.getTime() + UZ_OFFSET_MS;
  return new Date(uzTs);
}
function toUzIsoDay(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function uzMiddayTimestampForDayIso(dayIso: string): number {
  // dayIso is YYYY-MM-DD for Uzbekistan local date; midday at 12:00 UZ
  // Parse as UTC date then subtract offset to get UTC timestamp of UZ midday
  const [y, m, d] = dayIso.split("-").map(Number);
  // create a Date representing that day at 12:00 UZ in UTC ms:
  // UZ midday UTC = Date.UTC(y,m-1,d,12) - UZ_OFFSET_MS
  return Date.UTC(y, m - 1, d, 12) - UZ_OFFSET_MS;
}
function nextUzMiddayAfter(ts = Date.now()): number {
  const uz = getUzDate(ts);
  const todayIso = toUzIsoDay(uz);
  const todayMidTs = uzMiddayTimestampForDayIso(todayIso);
  if (ts < todayMidTs) return todayMidTs;
  // return tomorrow midday
  const tomorrow = new Date(uz.getTime() + 24 * 3600 * 1000);
  const tomoIso = toUzIsoDay(tomorrow);
  return uzMiddayTimestampForDayIso(tomoIso);
}

function generateWeeklyRewards(seed?: number): number[] {
  // If gameConfig defines explicit rewards array, use it. Otherwise generate 7 values between min/max deterministically by seed.
  const cfg = (gameConfig as any).dailyReward;
  if (cfg?.rewards && Array.isArray(cfg.rewards) && cfg.rewards.length === 7) {
    return cfg.rewards.slice();
  }
  const minC = cfg?.minCoins ?? 50;
  const maxC = cfg?.maxCoins ?? 300;
  const s = seed ?? Date.now();
  // simple deterministic pseudo-rand from seed
  const out: number[] = [];
  let r = s % 1000000;
  for (let i = 0; i < 7; i++) {
    r = (r * 1664525 + 1013904223) % 4294967296;
    const v = minC + Math.floor((r / 4294967296) * (maxC - minC + 1));
    out.push(v);
  }
  return out;
}

/**
 * Public API
 */
export function getDailyStatus() {
  const now = Date.now();
  const uz = getUzDate(now);
  const uzIso = toUzIsoDay(uz);
  const state = readState();
  const nextOpen = nextUzMiddayAfter(now);
  const available = (() => {
    // reward available if now >= today's midday (UZ) and lastClaimDateUz !== today
    const todayMidTs = uzMiddayTimestampForDayIso(uzIso);
    return now >= todayMidTs && state.lastClaimDateUz !== uzIso;
  })();
  const streak = state.streak ?? 0;
  const rewards = state.rewards ?? generateWeeklyRewards(state.rotationSeed);
  // determine dayIndex for UI: if lastClaimDateUz is today and claimed -> dayIndex = streak (1..7)
  // if not claimed yet but now >= midday -> dayIndex = streak + 1 (the upcoming claim)
  let nextDayIndex = Math.min(7, (streak ?? 0) + (available ? 1 : 0));
  return {
    available,
    nextOpenMs: available ? 0 : nextOpen,
    streak,
    nextDayIndex,
    rewards
  };
}

export function claimDailyReward() {
  const now = Date.now();
  const uz = getUzDate(now);
  const uzIso = toUzIsoDay(uz);
  const state = readState();
  const todayMidTs = uzMiddayTimestampForDayIso(uzIso);
  if (now < todayMidTs) return null; // not open yet
  if (state.lastClaimDateUz === uzIso) return null; // already claimed today
  // Determine new streak
  const last = state.lastClaimDateUz;
  let newStreak = 1;
  if (last) {
    // check if last was yesterday (UZ)
    const lastDt = new Date(Date.UTC(
      Number(last.slice(0,4)),
      Number(last.slice(5,7)) - 1,
      Number(last.slice(8,10))
    ));
    const lastMidTs = uzMiddayTimestampForDayIso(last);
    // compute difference in days based on uz local dates:
    const lastDay = new Date(lastDt.getTime());
    const curDay = new Date(uz.getTime());
    const diffDays = Math.round((curDay.getTime() - lastDay.getTime()) / (24*3600*1000));
    if (diffDays === 1) {
      newStreak = Math.min(7, (state.streak ?? 0) + 1);
    } else {
      newStreak = 1; // broken streak
    }
  }
  // Ensure rewards array
  const rewards = state.rewards ?? generateWeeklyRewards(state.rotationSeed);
  const dayIndex = Math.min(7, newStreak);
  const coins = rewards[dayIndex - 1] ?? Math.floor(((gameConfig as any).dailyReward?.minCoins ?? 50 + (gameConfig as any).dailyReward?.maxCoins ?? 300)/2);
  // Give coins
  const player = getPlayerData();
  player.coins += coins;
  updatePlayerData(player);
  // Update state
  state.lastClaimDateUz = uzIso;
  state.streak = newStreak;
  // If reached 7, rotate rewards and reset streak (start new cycle next day)
  if (newStreak >= 7) {
    state.rotationSeed = (state.rotationSeed || Date.now()) + 1;
    state.rewards = generateWeeklyRewards(state.rotationSeed);
    state.streak = 0; // next claim restarts cycle
    // record lastClaimDateUz remains as today so double-claim prevented
  }
  writeState(state);
  return { coins, dayIndex, streak: newStreak, rewards: state.rewards };
}
