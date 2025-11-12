// Пример интеграции Board в игровой цикл с вызовами звука
import { Board, Direction } from './src/game/Board';
import { buyAndApply } from './shop';
import audioManager from './src/audioManager';

const board = new Board(4,4);
export default board;

// Инициализация аудио (вызвать один раз при старте)
try { audioManager.init(); } catch { /* безопасный fallback */ }

// функция для обработки движения
export function handleMove(direction: Direction) {
  const result = board.move(direction);
  // если было движение — звук хода и появления плитки
  if (result.moved) {
    audioManager.play('move');
    // spawn выполняется внутри board.move() при moved === true, поэтому проигрываем spawn звук
    audioManager.play('spawn');
  }
  // если появилось очков (слияние) — проигрываем merge звук
  if (result.scoreDelta && result.scoreDelta > 0) {
    // Можно проигрывать несколько раз в зависимости от количества слияний, но здесь простой вызов
    audioManager.play('merge');
  }
  return result; // { moved: boolean, scoreDelta }
}

// покупка из магазина и немедленное применение
export async function purchaseAndEquip(userId: string | undefined, itemId: string) {
  const { newState, itemEffect, item } = await buyAndApply(userId, itemId);
  if (itemEffect) {
    board.applyItemEffect(itemEffect);
  }
  // звук покупки
  audioManager.play('purchase');
  return { newState, item };
}
