// Заготовка для PVP-клиента (React). Подключается к серверу gameConfig.pvp.onlineServerURL.
// Реальная интеграция сокетов и обмен игровыми состояниями — следующий шаг.

export function connectToPvp(serverUrl: string) {
  if (!serverUrl) throw new Error("PvP server URL not configured");
  const socket = (window as any).io?.(serverUrl);
  if (!socket) throw new Error("Socket.io client not available on window.io");
  return socket;
}