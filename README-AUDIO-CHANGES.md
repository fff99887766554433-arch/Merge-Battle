Добавлены AudioManager и интеграция звуковых эффектов.

Что сделано:
- Добавлен файл Merge Battle/audioManager.ts — менеджер воспроизведения звуков (HTMLAudioElement pools, mute, volume).
- Добавлен/обновлён Merge Battle/gameLoop.ts — пример вызовов audioManager.play('move'|'spawn'|'merge'|'purchase').

Что нужно вручную (рекомендуется):
1) Положите звуковые файлы в public/sounds/:
   - merge.mp3
   - move.mp3
   - spawn.mp3
   - purchase.mp3
   - coin.mp3
   - (опционально) ui_click.mp3

2) Внесите одно изменение в economy.ts, чтобы проигрывать звук при выдаче онбординга (пример):

import audioManager from './audioManager';

// внутри awardOnboardingIfNeeded после присвоения монет:
try { audioManager.play('coin'); } catch {}

3) Если хотите, можно добавить UI для управления звуком (выключатель, ползунок громкости) и вызывать audioManager.toggleMute()/setVolume.

Тестирование:
- npm install && npm run dev
- Убедитесь, что /sounds/<file>.mp3 доступны через браузер
- Выполните ход, покупку и онбординг — проверьте звуки.

Примечание: я не изменял economy.ts автоматически, чтобы не перезаписывать существующий код. Если хотите, могу внести это изменение и запушить отдельно.