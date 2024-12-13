export class Line {
  constructor(
    startX,
    startY,
    endX,
    endY,
    strokeStyle = "black",
    fillStyle = "black"
  ) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;

    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
  }

  /**
   *
   * @param {RenderingContext} ctx
   */
  createPath(ctx) {
    const { startX, startY, endX, endY } = this;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
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

  move(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }
}
