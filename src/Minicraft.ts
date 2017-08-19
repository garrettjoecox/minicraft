
import InputHandler from './InputHandler';
import Player from './entity/Player';
import GameCanvas from './GameCanvas';
import GameLoop from './GameLoop';

export default class Minicraft {
  private inputHandler: InputHandler = new InputHandler();
  private player: Player;
  private gameCanvas: GameCanvas;
  private gameLoop: GameLoop;

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.gameCanvas = new GameCanvas({ canvas });
    this.gameLoop = new GameLoop();
    this.player = new Player({ inputHandler: this.inputHandler });

    this.gameLoop.start();

    this.gameLoop.setTickHandler(() => {
      this.player.tick();
    });

    this.gameLoop.setRenderHandler(() => {
      this.gameCanvas.clear();
      this.player.render(this.gameCanvas);
      this.gameLoop.renderStats(this.gameCanvas);
      this.gameCanvas.updateBuffer();
    });
  }
}

(<any>window).Minicraft = Minicraft;
