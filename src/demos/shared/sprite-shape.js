import { Polygon } from "./polygon.js";
import { Point } from "./point.js";

export class SpriteShape extends Polygon {
  constructor(sprite) {
    super();
    this.sprite = sprite;
    this.setPolygonPoints();
  }

  setPolygonPoints() {
    const { left, top, width, height } = this.sprite;

    this.points = [
      new Point(left, top),
      new Point(left + width, top),
      new Point(left + width, top + height),
      new Point(left, top + height),
    ];
  }

  move(dx, dy) {
    this.sprite.left += dx;
    this.sprite.top += dy;

    this.setPolygonPoints();
  }

  /**
   *
   * @param {RenderingContext} ctx
   */
  createPath(ctx) {
    ctx.beginPath();
    const { left, top, width, height } = this.sprite;
    ctx.rect(left, top, width, height);
  }

  stroke(ctx) {
    this.sprite.paint(ctx);
  }

  fill(ctx) {}
}
