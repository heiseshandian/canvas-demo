export class Circle {
  constructor(
    x,
    y,
    radius,
    strokeStyle = "black",
    fillStyle = "black",
    counterClockWise = false
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.counterClockWise = counterClockWise;

    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
  }

  /**
   *
   * @param {RenderingContext} ctx
   */
  createPath(ctx) {
    const { x, y, radius, counterClockWise } = this;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, counterClockWise);
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

  move(x, y) {
    this.x = x;
    this.y = y;
  }
}
