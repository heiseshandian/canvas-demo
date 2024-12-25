import { Sprite } from "./sprite.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const offscreenCanvas = document.createElement("canvas");
const offscreenCtx = offscreenCanvas.getContext("2d");

canvas.width = offscreenCanvas.width = 800;
canvas.height = offscreenCanvas.height = 600;

const ball = new Sprite(
  "ball",
  {
    /**
     *
     * @param {Sprite} sprite
     * @param {RenderingContext} ctx
     */
    paint(sprite, ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        sprite.left + sprite.width / 2,
        sprite.top + sprite.height / 2,
        ball.width / 2,
        0,
        Math.PI * 2,
        false
      );
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.restore();
    },
  },
  [
    {
      execute(sprite) {
        sprite.left += sprite.velocityX;
        sprite.top += sprite.velocityY;
      },
    },
  ]
);
ball.left = 10;
ball.top = 10;
ball.width = ball.height = 20;
ball.velocityX = 2;
ball.velocityY = 2;

function handleCollision() {
  if (ball.left < 0 || ball.left + ball.width > canvas.width) {
    ball.velocityX = -ball.velocityX;
  }
  if (ball.top < 0 || ball.top + ball.height > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }
}

ball.paint(ctx);

function drawGrid(stepX = 10, stepY = 10, color = "#bbb", context = ctx) {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 0.5;

  for (let x = 0.5; x < canvas.width; x += stepX) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }

  for (let y = 0.5; y < canvas.height; y += stepY) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }
  context.restore();
}

function fixBackgroundByRedrawing() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
}

function fixBackgroundByClip() {
  ctx.save();
  ctx.beginPath();

  ctx.arc(
    ball.left + ball.width / 2,
    ball.top + ball.height / 2,
    ball.width / 2 + 10,
    0,
    Math.PI * 2,
    false
  );
  ctx.clip();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  ctx.restore();
}

function fixBackgroundByOffscreen() {
  ctx.save();
  ctx.beginPath();

  ctx.arc(
    ball.left + ball.width / 2,
    ball.top + ball.height / 2,
    ball.width / 2 + 1,
    0,
    Math.PI * 2,
    false
  );
  ctx.clip();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    offscreenCanvas,
    ball.left,
    ball.top,
    ball.width + 4,
    ball.height + 4,
    ball.left,
    ball.top,
    ball.width + 4,
    ball.height + 4
  );
  ctx.restore();
}

function animate() {
  fixBackgroundByOffscreen();

  ball.update(ctx);
  ball.paint(ctx);
  handleCollision();
  requestAnimationFrame(animate);
}

drawGrid(10, 10, "#bbb", offscreenCtx);
drawGrid();
animate();
