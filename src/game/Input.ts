export class Input {
  private keysPressed: Set<string> = new Set();

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keysPressed.add(e.code);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keysPressed.delete(e.code);
  };

  listen() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  isKeyPressed(code: string): boolean {
    return this.keysPressed.has(code);
  }
}