// Простой локальный менеджер челленджей (сохранение в localStorage).
// Позволяет регистрировать события и отслеживать прогресс + выдавать награды.

const STORAGE_KEY = "merge_battle_challenges_v1";

export type Challenge = {
  id: string;
  title: string;
  description?: string;
  goal: number;
  progress: number;
  rewardCoins: number;
  completed?: boolean;
  claimDate?: string;
  period?: "daily" | "weekly" | "oneoff";
};

function readAll(): Challenge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultChallenges();
    return JSON.parse(raw) as Challenge[];
  } catch {
    return defaultChallenges();
  }
}
function writeAll(ch: Challenge[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ch));
}
function defaultChallenges(): Challenge[] {
  return [
    { id: "daily_merge_5", title: "Сделать 5 слияний", goal: 5, progress: 0, rewardCoins: 100, period: "daily" },
    { id: "daily_score_500", title: "Набрать 500 очков", goal: 500, progress: 0, rewardCoins: 150, period: "daily" }
  ];
}

export function getChallenges() {
  return readAll();
}
export function incrementProgress(eventId: string, amount = 1) {
  const all = readAll();
  // простая логика: map eventId -> challenge id (можно расширить)
  for (const c of all) {
    if (c.completed) continue;
    // простая сопоставительная логика:
    if (eventId.includes("merge") && c.id.includes("merge")) {
      c.progress = Math.min(c.goal, c.progress + amount);
      if (c.progress >= c.goal) c.completed = true;
    }
    if (eventId.includes("score") && c.id.includes("score")) {
      c.progress = Math.min(c.goal, c.progress + amount);
      if (c.progress >= c.goal) c.completed = true;
    }
  }
  writeAll(all);
  return all;
}
export function claimChallenge(id: string) {
  const all = readAll();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return null;
  const c = all[idx];
  if (!c.completed) return null;
  if (c.claimDate) return null; // уже забрал
  // награждение: возврат coins, остальное внешняя логика
  c.claimDate = new Date().toISOString();
  writeAll(all);
  return c;
}