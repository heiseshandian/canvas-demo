export class Sprite {
  constructor(name, painter, behaviors) {
    if (name !== undefined) this.name = name;
    if (painter !== undefined) this.painter = painter;

    this.top = 0;
    this.left = 0;
    this.width = 10;
    this.height = 10;
    this.velocityX = 0;
    this.velocityY = 0;
    this.visible = true;
    this.animating = false;
    this.behaviors = behaviors || [];
  }

  /**
   * @param {RenderingContext} ctx
   */
  paint(ctx) {
    if (this.painter && this.visible) {
      this.painter.paint(this, ctx);
    }
  }

  /**
   * @param {RenderingContext} ctx
   */
  update(ctx, time) {
    for (let i = 0; i < this.behaviors.length; i++) {
      this.behaviors[i].execute(this, ctx, time);
    }
  }
}
