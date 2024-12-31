import { MinimumTranslationVector } from "./minimum-translation-vector.js";

export class Shape {
  minimumTranslationVector(axes, otherShape) {
    let axisWithMinOverlap = null;
    let minOverlap = Infinity;

    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      const p1 = this.project(axis);
      const p2 = otherShape.project(axis);
      const overlap = p1.overlap(p2);

      if (overlap === 0) {
        return new MinimumTranslationVector(undefined, 0);
      }
      if (overlap < minOverlap) {
        minOverlap = overlap;
        axisWithMinOverlap = axis;
      }
    }

    return new MinimumTranslationVector(axisWithMinOverlap, minOverlap);
  }

  separationOnAxes(axes, otherShape) {
    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      const p1 = this.project(axis);
      const p2 = otherShape.project(axis);

      if (!p1.overlaps(p2)) {
        return true; // Found a separating axis
      }
    }
    return false; // No separating axis found
  }

  /**
   *
   * @param {RenderingContext} ctx
   */
  stroke(ctx) {
    ctx.save();
    ctx.strokeStyle = this.strokeStyle;
    this.createPath(ctx);
    ctx.stroke();
    ctx.restore();
  }

  /**
   *
   * @param {RenderingContext} ctx
   */
  fill(ctx) {
    ctx.save();
    ctx.fillStyle = this.fillStyle;
    this.createPath(ctx);
    ctx.fill();
    ctx.restore();
  }

  collidesWith(otherShape) {
    throw new Error("Should be implemented by the sub class");
  }

  getAxes() {
    throw new Error("Should be implemented by the sub class");
  }

  project(axis) {
    throw new Error("Should be implemented by the sub class");
  }

  getBoundingBox() {
    throw new Error("Should be implemented by the sub class");
  }
}
