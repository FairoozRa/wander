interface TiledLayer {
  data: number[];
  width: number;
  height: number;
  name: string;
  visible: boolean;
  opacity: number;
}

interface TiledTileset {
  firstgid: number;
  columns: number;
  tilewidth: number;
  tileheight: number;
  image: string;
}

interface TiledMapData {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
  tilesets: TiledTileset[];
}

export class TileMap {
  private mapData: TiledMapData;
  private tilesetImage: HTMLImageElement;
  private tileWidth: number;
  private tileHeight: number;
  private columns: number;
  private firstGid: number;
  private isLoaded: boolean = false;

  constructor(mapData: TiledMapData, tilesetSrc: string) {
    this.mapData = mapData;
    this.tileWidth = mapData.tilewidth;
    this.tileHeight = mapData.tileheight;

    const tileset = mapData.tilesets[0];
    this.columns = tileset.columns;
    this.firstGid = tileset.firstgid;

    this.tilesetImage = new Image();
    this.tilesetImage.onload = () => {
      this.isLoaded = true;
    };
    this.tilesetImage.src = tilesetSrc;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isLoaded) return;

    for (const layer of this.mapData.layers) {
      if (!layer.visible) continue;
      this.drawLayer(ctx, layer);
    }
  }

  private drawLayer(ctx: CanvasRenderingContext2D, layer: TiledLayer) {
    for (let row = 0; row < layer.height; row++) {
      for (let col = 0; col < layer.width; col++) {
        const gid = layer.data[row * layer.width + col];
        if (gid === 0) continue; // 0 = empty cell, nothing to draw

        const tileIndex = gid - this.firstGid;
        const sx = (tileIndex % this.columns) * this.tileWidth;
        const sy = Math.floor(tileIndex / this.columns) * this.tileHeight;

        const dx = col * this.tileWidth;
        const dy = row * this.tileHeight;

        ctx.drawImage(
          this.tilesetImage,
          sx, sy, this.tileWidth, this.tileHeight,
          dx, dy, this.tileWidth, this.tileHeight
        );
      }
    }
  }
}