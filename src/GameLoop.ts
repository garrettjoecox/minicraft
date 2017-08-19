
import GameCanvas from './GameCanvas';

export default class GameLoop {
  private tickHandler: Function;
  private renderHandler: Function;
  private running: boolean = false;
  private lastFrame: number;
  private unprocessed: number = 0;
  private msPerTick: number = 1000 / 60;
  private fps: number = 60;
  private stats: { updateTime: number; renderTime: number; frameTime: number; frameCount: number; fps: number; } = {
    updateTime: 0,
    renderTime: 0,
    frameTime: 0,
    frameCount: 0,
    fps: 0,
  };

  start() {
    this.running = true;
    this.lastFrame = this.timestamp();
    this.frame();
  }

  stop() {
    this.running = false;
  }

  renderStats(gameCanvas: GameCanvas) {
    gameCanvas.ctx.fillStyle = 'white';
    gameCanvas.ctx.font = '9pt sans-serif';
    gameCanvas.ctx.fillText(`frame: ${this.stats.frameCount}`, gameCanvas.width - 100, gameCanvas.height - 75);
    gameCanvas.ctx.fillText(`fps: ${this.stats.fps}`, gameCanvas.width - 100, gameCanvas.height - 60);
    gameCanvas.ctx.fillText(`update: ${this.stats.updateTime}ms`, gameCanvas.width - 100, gameCanvas.height - 45);
    gameCanvas.ctx.fillText(`render: ${this.stats.renderTime}ms`, gameCanvas.width - 100, gameCanvas.height - 30);
  }

  setTickHandler(handler) {
    this.tickHandler = handler;
  }

  removeTickHandler() {
    delete this.tickHandler;
  }

  setRenderHandler(handler) {
    this.renderHandler = handler;
  }

  removeRenderHandler() {
    delete this.renderHandler;
  }

  private frame() {
    const start = this.timestamp();
    this.unprocessed += (start - this.lastFrame) / this.msPerTick;
    while (this.unprocessed >= 1) {
      this.emitTick();
      this.unprocessed -= 1;
    }

    const middle = this.timestamp();
    this.emitRender();

    const end = this.timestamp();
    this.updateStats(middle - start, end - middle);

    this.lastFrame = start;
    if (this.running) requestAnimationFrame(() => this.frame());
  }

  private timestamp() {
    return window.performance.now();
  }

  private emitTick() {
    if (this.tickHandler) this.tickHandler();
  }

  private emitRender() {
    if (this.renderHandler) this.renderHandler();
  }

  private updateStats(updateTime: number, renderTime: number) {
    this.stats.updateTime = Math.floor(Math.max(1, updateTime));
    this.stats.renderTime = Math.floor(Math.max(1, renderTime));
    this.stats.frameTime = this.stats.updateTime + this.stats.renderTime;
    this.stats.frameCount =  this.stats.frameCount === this.fps ? 0 : this.stats.frameCount + 1;
    this.stats.fps = Math.floor(Math.min(this.fps, 1000 / this.stats.frameTime));
  }
}
