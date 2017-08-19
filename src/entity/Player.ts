
import Entity from './Entity';
import InputHandler from '../InputHandler';
import GameCanvas from '../GameCanvas';

export default class Player extends Entity {
  private inputHandler: InputHandler;
  public x: number = 0;
  public y: number = 0;

  constructor({ inputHandler }: { inputHandler: InputHandler }) {
    super();

    this.inputHandler = inputHandler;
  }

  tick() {
    let xa = 0;
    let ya = 0;
    if (this.inputHandler.state.up) ya -= 1;
    if (this.inputHandler.state.down) ya += 1;
    if (this.inputHandler.state.left) xa -= 1;
    if (this.inputHandler.state.right) xa += 1;

    super.move(xa, ya);
  }

  render(gameCanvas: GameCanvas) {
    gameCanvas.ctx.fillStyle = 'white';
    gameCanvas.ctx.beginPath();
    gameCanvas.ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    gameCanvas.ctx.fill();
  }
}
