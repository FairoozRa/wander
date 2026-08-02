import { useRef, useEffect } from 'react';
import { Player } from '../game/Player';
import { Input } from '../game/Input';
import characterSprite from '../assets/sprites/character1.png';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    canvas.tabIndex = 0;
    canvas.focus();

    const sprite = new Image();
    sprite.src = characterSprite;

    const input = new Input();
    input.listen();

    let player: Player | null = null;
    let lastTime = performance.now();
    let animationFrameId: number;

    const loop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (player) {
        player.update(input, deltaTime);
        player.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    sprite.onload = () => {
      player = new Player(
        CANVAS_WIDTH / 2 - 25,
        CANVAS_HEIGHT / 2 - 25,
        50,
        50,
        sprite,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      input.destroy();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
    />
  );
}