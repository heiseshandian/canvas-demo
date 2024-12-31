import { Sprite } from "./sprite.js";

export class ImagePainter {
  /**
   *
   * @param {string} imgSrc
   * @param {boolean} shouldUpdateSizeOfSprite
   */
  constructor(imgSrc, shouldUpdateSizeOfSprite = false) {
    this.img = new Image();
    this.img.src = imgSrc;
    this.shouldUpdateSizeOfSprite = shouldUpdateSizeOfSprite;
  }

  /**
   *
   * @param {Sprite} sprite
   * @param {RenderingContext} ctx
   */
  paint(sprite, ctx) {
    if (this.img.complete) {
      this.draw(sprite, ctx);
    } else {
      this.img.onload = () => {
        this.draw(sprite, ctx);
      };
    }
  }

  /**
   *
   * @param {Sprite} sprite
   * @param {RenderingContext} ctx
   */
  draw(sprite, ctx) {
    const { shouldUpdateSizeOfSprite } = this;
    const { width: imgWidth, height: imgHeight } = this.img;
    if (shouldUpdateSizeOfSprite) {
      sprite.width = imgWidth;
      sprite.height = imgHeight;
    }

    const { left, top, width, height } = sprite;
    ctx.drawImage(this.img, left, top, width, height);
  }
}
