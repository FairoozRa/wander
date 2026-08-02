import { useRef, useEffect } from 'react';
import { Game } from '../game/Game';
import characterSprite from '../assets/sprites/character1.png';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new Game(canvas, characterSprite);
    game.start();

    return () => {
      game.destroy();
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