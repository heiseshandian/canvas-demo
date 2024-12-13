export class Rect {
  constructor(x, y, offsetX, offsetY, strokeStyle, fillStyle) {
    this.x = Math.min(x, offsetX);
    this.y = Math.min(y, offsetY);
    this.width = Math.abs(offsetX - x);
    this.height = Math.abs(offsetY - y);

    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
  }

  /**
   *
   * @param {RenderingContext} ctx
   */
  createPath(ctx) {
    const { x, y, width, height } = this;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
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
