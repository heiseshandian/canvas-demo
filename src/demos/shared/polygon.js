import { Shape } from "./shape.js";
import { Vector } from "./vector.js";
import { Projection } from "./projection.js";
import { polygonCollidesWithCircle } from "./utils.js";
import { BoundingBox } from "./bounding-box.js";

export class Polygon extends Shape {
  constructor(points, strokeStyle = "black", fillStyle = "black") {
    super();
    this.points = points;
    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
  }

  /**
   *
   * @param {Shape} shape
   */
  collidesWith(shape) {
    const axes = shape.getAxes();
    if (!axes) {
      // circle
      return polygonCollidesWithCircle(this, shape);
    }

    return this.minimumTranslationVector(axes.concat(this.getAxes()), shape);
  }

  getAxes() {
    const points = this.points;
    const axes = Array(points.length);
    const v1 = new Vector();
    const v2 = new Vector();

    for (let i = 0; i < points.length; i++) {
      v1.x = points[i].x;
      v1.y = points[i].y;

      v2.x = points[(i + 1) % points.length].x;
      v2.y = points[(i + 1) % points.length].y;

      axes[i] = v1.edge(v2).normal();
    }

    return axes;
  }

  project(axis) {
    let min = axis.dotProduct(new Vector(this.points[0].x, this.points[0].y));
    let max = min;

    // Project all points onto the axis and find min/max
    for (let i = 1; i < this.points.length; i++) {
      const p = new Vector(this.points[i].x, this.points[i].y);
      const projection = axis.dotProduct(p);

      if (projection < min) {
        min = projection;
      }
      if (projection > max) {
        max = projection;
      }
    }

    return new Projection(min, max);
  }

  move(deltaX, deltaY) {
    for (const point of this.points) {
      point.x += deltaX;
      point.y += deltaY;
    }
  }

  createPath(ctx) {
    const points = this.points;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
  }

  getBoundingBox() {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = Infinity;
    let maxY = Infinity;

    this.points.forEach(({ x, y }) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    return new BoundingBox(minX, minY, maxX - minX, maxY - minY);
  }
}
