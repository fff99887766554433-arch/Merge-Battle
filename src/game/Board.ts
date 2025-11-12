// Merge Battle/src/game/Board.ts — минимальная заглушка
export type Direction = 'up'|'down'|'left'|'right';

export class Board {
  width: number; height: number;
  constructor(w:number,h:number){ this.width=w; this.height=h }
  move(dir: Direction) {
    return { moved: false, scoreDelta: 0 };
  }
  applyItemEffect(_effect:any){}
}
