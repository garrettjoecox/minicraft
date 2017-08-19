
export default class GameCanvas {
  private frontCanvas: HTMLCanvasElement;
  private backCanvas: HTMLCanvasElement;
  private frontCtx: CanvasRenderingContext2D;
  private backCtx: CanvasRenderingContext2D;
  public width: number;
  public height: number;

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.frontCanvas = canvas;
    this.frontCtx = this.frontCanvas.getContext('2d');
    this.width = this.frontCanvas.offsetWidth;
    this.height = this.frontCanvas.offsetHeight;
    this.backCanvas = document.createElement('canvas');
    this.backCtx = this.backCanvas.getContext('2d');
    this.backCanvas.width = this.width;
    this.backCanvas.height = this.height;
  }

  get ctx() {
    return this.backCtx;
  }

  clear() {
    this.backCtx.clearRect(0, 0, this.width, this.height);
  }

  updateBuffer() {
    this.frontCtx.clearRect(0, 0, this.width, this.height);
    this.frontCtx.drawImage(this.backCanvas, 0, 0);
  }
}
