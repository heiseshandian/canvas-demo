import { Shape } from "./shape.js";
import { Vector } from "./vector.js";
import { Projection } from "./projection.js";
import { polygonCollidesWithCircle } from "./utils.js";
import { MinimumTranslationVector } from "./minimum-translation-vector.js";

export class Circle extends Shape {
  constructor(
    x,
    y,
    radius,
    strokeStyle = "rgba(255, 253, 208, 0.9)",
    fillStyle = "rgba(147, 197, 114, 0.8)"
  ) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
  }

  /**
   *
   * @param {RenderingContext} ctx
   */
  createPath(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  getAxes() {
    return null;
  }

  /**
   *
   * @param {Shape} shape
   */
  collidesWith(shape) {
    const axes = shape.getAxes();

    // circle
    if (!axes) {
      const distance = Math.sqrt(
        Math.pow(this.x - shape.x, 2) + Math.pow(this.y - shape.y, 2)
      );
      const overlap = this.radius + shape.radius - distance;
      return new MinimumTranslationVector(undefined, Math.max(0, overlap));
    }
    return polygonCollidesWithCircle(shape, this);
  }

  project(axis) {
    const dotProduct = new Vector(this.x, this.y).dotProduct(axis);
    return new Projection(dotProduct - this.radius, dotProduct + this.radius);
  }
}
