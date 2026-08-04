import { GameObject } from './GameObject';
import { Input } from './Input';

const FRAME_SIZE = 32;
const IDLE_FRAME_DURATION = 0.5;
const WALK_FRAME_DURATION = 0.12;

type MovementState = 'IDLE' | 'WALKING';
type Direction = 'DOWN' | 'RIGHT' | 'BACK' | 'LEFT';

const ROWS: Record<Direction, { idleRow: number; walkRow: number }> = {
  DOWN: { idleRow: 0, walkRow: 1 },
  RIGHT: { idleRow: 2, walkRow: 3 },
  BACK: { idleRow: 4, walkRow: 5 },
  LEFT: { idleRow: 2, walkRow: 3 },
};

const IDLE_FRAME_COUNT = 2;
const WALK_FRAME_COUNT = 6;

export class Player extends GameObject {
  speed: number;
  private sprite: HTMLImageElement;

  private canvasWidth: number;
  private canvasHeight: number;

  private movementState: MovementState = 'IDLE';
  private direction: Direction = 'DOWN';

  private frameIndex: number = 0;
  private frameTimer: number = 0;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    sprite: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number
  ) {
    super(x, y, width, height);
    this.speed = 200;
    this.sprite = sprite;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  update(input: Input, deltaTime: number) {
    const distance = this.speed * deltaTime;

    const up = input.isKeyPressed('KeyW');
    const down = input.isKeyPressed('KeyS');
    const left = input.isKeyPressed('KeyA');
    const right = input.isKeyPressed('KeyD');

    const isMoving = up || down || left || right;

    if (up) this.y -= distance;
    if (down) this.y += distance;
    if (left) this.x -= distance;
    if (right) this.x += distance;

    this.clampToBounds();

    let newDirection: Direction = this.direction;
    if (up) newDirection = 'BACK';
    else if (down) newDirection = 'DOWN';
    else if (left) newDirection = 'LEFT';
    else if (right) newDirection = 'RIGHT';

    const newMovementState: MovementState = isMoving ? 'WALKING' : 'IDLE';

    if (newDirection !== this.direction || newMovementState !== this.movementState) {
      this.frameIndex = 0;
      this.frameTimer = 0;
    }

    this.direction = newDirection;
    this.movementState = newMovementState;

    this.updateAnimation(deltaTime);
  }

  private clampToBounds() {
    const minX = 0;
    const maxX = this.canvasWidth - this.width;
    const minY = 0;
    const maxY = this.canvasHeight - this.height;

    this.x = Math.min(Math.max(this.x, minX), maxX);
    this.y = Math.min(Math.max(this.y, minY), maxY);
  }

  private updateAnimation(deltaTime: number) {
    const isWalking = this.movementState === 'WALKING';
    const frameDuration = isWalking ? WALK_FRAME_DURATION : IDLE_FRAME_DURATION;
    const frameCount = isWalking ? WALK_FRAME_COUNT : IDLE_FRAME_COUNT;

    this.frameTimer += deltaTime;

    if (this.frameTimer >= frameDuration) {
      this.frameTimer -= frameDuration;
      this.frameIndex = (this.frameIndex + 1) % frameCount;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawShadow(ctx);
    this.drawSprite(ctx);
  }

  private drawShadow(ctx: CanvasRenderingContext2D) {
    const shadowWidth = this.width * 0.6;
    const shadowHeight = this.height * 0.18;
    const shadowX = this.x + (this.width - shadowWidth) / 2;
    const shadowY = this.y + this.height - shadowHeight / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(shadowX, shadowY, shadowWidth, shadowHeight);
  }

  private drawSprite(ctx: CanvasRenderingContext2D) {
    const isWalking = this.movementState === 'WALKING';
    const { idleRow, walkRow } = ROWS[this.direction];
    const row = isWalking ? walkRow : idleRow;

    const sourceX = this.frameIndex * FRAME_SIZE;
    const sourceY = row * FRAME_SIZE;

    if (this.direction === 'LEFT') {
      ctx.save();
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
      ctx.drawImage(this.sprite, sourceX, sourceY, FRAME_SIZE, FRAME_SIZE, 0, 0, this.width, this.height);
      ctx.restore();
    } else {
      ctx.drawImage(this.sprite, sourceX, sourceY, FRAME_SIZE, FRAME_SIZE, this.x, this.y, this.width, this.height);
    }
  }
}