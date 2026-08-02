import { Player } from './Player';
import { Input } from './Input';

export class Game {
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;

  private input: Input;
  private player: Player | null = null;
  private sprite: HTMLImageElement;

  private lastTime: number = 0;
  private animationFrameId: number = 0;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement, spriteSrc: string) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D rendering context');
    }
    this.ctx = ctx;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.ctx.imageSmoothingEnabled = false;

    canvas.tabIndex = 0;
    canvas.focus();

    this.input = new Input();

    this.sprite = new Image();
    this.sprite.src = spriteSrc;
  }

  start() {
    this.input.listen();

    this.sprite.onload = () => {
      this.player = new Player(
        this.canvasWidth / 2 - 25,
        this.canvasHeight / 2 - 25,
        50,
        50,
        this.sprite,
        this.canvasWidth,
        this.canvasHeight
      );
    };

    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  private loop = (currentTime: number) => {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.draw();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(deltaTime: number) {
    if (this.player) {
      this.player.update(this.input, deltaTime);
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (this.player) {
      this.player.draw(this.ctx);
    }
  }

  destroy() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
    this.input.destroy();
  }
}