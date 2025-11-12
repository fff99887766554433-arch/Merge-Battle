// leaderboard.ts
import { gameConfig } from "./gameConfig";

const LB_KEY = gameConfig.leaderboard.localKey || "leaderboard";

export type ScoreEntry = {
  name: string;
  score: number;
  ts: number;
};

/** Сохранить результат */
export function saveScore(name: string, score: number) {
  const data: ScoreEntry[] = JSON.parse(localStorage.getItem(LB_KEY) || "[]");
  data.push({ name, score, ts: Date.now() });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem(LB_KEY, JSON.stringify(data.slice(0, 100)));
}

/** Получить топ N игроков */
export function getTopScores(n = 20): ScoreEntry[] {
  return JSON.parse(localStorage.getItem(LB_KEY) || "[]").slice(0, n);
}

/** Очистить таблицу */
export function clearLeaderboard() {
  localStorage.removeItem(LB_KEY);
}
