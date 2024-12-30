import { Sprite } from "../shared/sprite.js";
import { AnimationTimer } from "../shared/animation-timer.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const METERS = 10;
const GRAVITY = 9.81; // meters per second
const PIXELS_PER_METER = canvas.height / METERS;
let fps = 120;

const timer = new AnimationTimer();

const moveBall = {
  lastFrameTime: null,

  execute(sprite) {
    if (!this.lastFrameTime) {
      this.lastFrameTime = performance.now();
      return;
    }

    sprite.top += sprite.velocityY / fps;
    sprite.left += sprite.velocityX / fps;

    sprite.velocityY =
      GRAVITY * (timer.getElapsedTime() / 1000) * PIXELS_PER_METER;
  },
};

const arrow = new Sprite("arrow", {
  paint(sprite) {
    const { left, top, width, height } = sprite;

    if (!timer.running) {
      ctx.save();

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      ctx.beginPath();
      ctx.moveTo(left, top + height / 2);
      ctx.lineTo(left + width, top);
      ctx.lineTo(left + width, top + height);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.strokeRect(left, top, width / 4, height);
      ctx.strokeRect(left + width / 2, top, width / 4, height);
    }
  },
});

const ball = new Sprite(
  "ball",
  {
    paint(sprite) {
      const { left, top, width, height } = sprite;
      ctx.beginPath();
      ctx.arc(left + width / 2, top + height / 2, width / 2, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
  [moveBall]
);

const desk = new Sprite("desk", {
  paint(sprite) {
    const { left, top, width, height } = sprite;
    ctx.fillRect(left, top, width, height);
  },
});

arrow.left = canvas.width / 2 - 50;
arrow.top = canvas.height / 2 - 50;
arrow.width = 100;
arrow.height = 100;
arrow.paint();

ball.left = 100;
ball.top = 100;
ball.width = 50;
ball.height = 50;
ball.velocityX = 10; // pixes per second
ball.velocityY = 0;
ball.paint();

desk.left = 100;
desk.top = ball.top + ball.height;
desk.width = 50;
desk.paint();

function fixBackground(sprite) {
  const { left, top, width, height } = sprite;
  ctx.save();
  ctx.beginPath();
  ctx.rect(
    left - ctx.lineWidth * 2,
    top - ctx.lineWidth * 2,
    width + 4 * ctx.lineWidth,
    height + 4 * ctx.lineWidth
  );
  ctx.clip();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function bindEvents() {
  canvas.addEventListener("click", ({ offsetX, offsetY }) => {
    const { left, top, width, height } = arrow;
    ctx.beginPath();
    ctx.rect(left, top, width, height);
    if (!ctx.isPointInPath(offsetX, offsetY)) {
      return;
    }

    if (timer.running) {
      timer.stop();
    } else {
      timer.start();
      requestAnimationFrame(animate);
    }

    fixBackground(arrow);
    arrow.paint();
  });
}

bindEvents();

let lastFrameTime = null;
function animate(time) {
  if (lastFrameTime === null) {
    lastFrameTime = time;
  } else {
    fps = 1000 / (time - lastFrameTime);
    lastFrameTime = time;
  }

  if (timer.running) {
    fixBackground(ball);
    ball.update();
    ball.paint();
    requestAnimationFrame(animate);
  }
}
requestAnimationFrame(animate);
