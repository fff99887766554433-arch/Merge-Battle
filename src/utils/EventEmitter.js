// src/utils/EventEmitter.js
// Лёгкий emitter — on/off/emit с поддержкой отписки через возвращаемую функцию.

export default class EventEmitter {
  constructor() {
    this._listeners = {};
  }

  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = new Set();
    this._listeners[event].add(cb);
    // возвращаем функция отписки для удобства
    return () => this.off(event, cb);
  }

  off(event, cb) {
    if (!this._listeners[event]) return;
    this._listeners[event].delete(cb);
  }

  emit(event, payload) {
    if (!this._listeners[event]) return;
    for (const cb of Array.from(this._listeners[event])) {
      try {
        cb(payload);
      } catch (err) {
        // не ломаем цикл при ошибках в обработчиках
        // логируем в консоль
        // в RN консоль будет видна в Metro
        // eslint-disable-next-line no-console
        console.warn(`Event handler for ${event} threw`, err);
      }
    }
  }

  clear() {
    this._listeners = {};
  }
}