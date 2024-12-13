export class Polygon {
  constructor(
    x,
    y,
    radius,
    sides = 3,
    strokeStyle = "black",
    fillStyle = "black",
    startAngle = 0
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sides = sides;
    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
    this.startAngle = startAngle;
  }

  getPoints() {
    const { radius, startAngle, sides } = this;
    let angle = startAngle;
    const points = Array(sides);
    for (let i = 0; i < sides; i++) {
      points[i] = [radius * Math.cos(angle), radius * Math.sin(angle)];
      angle += (Math.PI * 2) / sides;
    }

    return points;
  }

  /**
   *
   * @param {RenderingContext} ctx
   */
  createPath(ctx) {
    const { x, y } = this;
    const points = this.getPoints();

    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(...points[i]);
    }
    ctx.closePath();
    ctx.restore();
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
    ctx.stroke();
    ctx.restore();
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }
}
