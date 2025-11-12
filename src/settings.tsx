// Заготовка компонента настроек (React). Использует localStorage для сохранения настроек.

import { useState, useEffect } from "react";

const KEY = "merge_battle_settings_v1";
export type SettingsSchema = {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number; // 0..1
  language: string;
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { soundEnabled: true, musicEnabled: true, volume: 0.8, language: "ru" };
    return JSON.parse(raw) as SettingsSchema;
  } catch {
    return { soundEnabled: true, musicEnabled: true, volume: 0.8, language: "ru" };
  }
}

export default function SettingsPanel() {
  const [s, setS] = useState<SettingsSchema>(read());
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(s));
    // TODO: notify audioManager
  }, [s]);
  return (
    // Возьмите этот JSX/TSX как шаблон. UI-реализация подробностей — в следующей итерации.
    null as any
  );
}