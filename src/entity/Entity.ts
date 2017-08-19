
import GameCanvas from '../GameCanvas';

export default class Entity {
  public x: number;
  public y: number;

  tick() {

  }

  render(gameCanvas: GameCanvas) {

  }

  remove() {

  }

  move(xa, ya) {
    if (xa !== 0 || ya !== 0) {
      this.x += xa;
      this.y += ya;
    }
  }
}
