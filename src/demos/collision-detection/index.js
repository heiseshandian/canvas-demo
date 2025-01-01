import { Circle } from "../shared/circle.js";
import { Point } from "../shared/point.js";
import { Polygon } from "../shared/polygon.js";
import { Sprite } from "../shared/sprite.js";
import { ImagePainter } from "../shared/image-painter.js";
import { SpriteShape } from "../shared/sprite-shape.js";
import { AnimationTimer } from "../shared/animation-timer.js";
import { MinimumTranslationVector } from "../shared/minimum-translation-vector.js";
import { Vector } from "../shared/vector.js";
import { Shape } from "../shared/shape.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

ctx.globalAlpha = 0.9;

const velocity = {
  x: 200, // pixes per second
  y: 200,
};

const longmao = new Sprite("longmao", new ImagePainter("./longmao.png"));
longmao.left = 100;
longmao.top = 350;
longmao.width = 130;
longmao.height = 200;

const longmaoShape = new SpriteShape(longmao);

const ball = new Sprite("rect", {
  paint(sprite, ctx) {
    const { left, top, width, height } = sprite;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const radius = width / 2;

    // 创建径向渐变 (Radial Gradient)
    const gradient = ctx.createRadialGradient(
      centerX - radius / 3, // 光源 X 坐标
      centerY - radius / 3, // 光源 Y 坐标
      radius / 6, // 光源半径
      centerX, // 外圈 X 坐标
      centerY, // 外圈 Y 坐标
      radius // 外圈半径
    );

    // 定义渐变色
    gradient.addColorStop(0, "white"); // 光源颜色
    gradient.addColorStop(0.5, "#87CEFA"); // 中间颜色（球体主色）
    gradient.addColorStop(1, "#4682B4"); // 边缘阴影颜色

    // 绘制圆形
    ctx.save();
    ctx.beginPath();
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    ctx.shadowBlur = 20;
    ctx.fillStyle = gradient;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  },
});
ball.left = 500;
ball.top = 400;
ball.width = 40;
ball.height = 40;

const rectShape = new SpriteShape(ball);

const colors = [
  "#D45D6D", // 温暖的红色
  "#6B9D8F", // 柔和的青色
  "#F4C7B9", // 浅粉色
  "#9A4D76", // 深玫瑰色
  "#2E7D9F", // 蓝绿色
  "#F0A500", // 明亮的黄色
];
let i = 0;
const polygons = [
  [new Point(100, 100), new Point(120, 150), new Point(100, 300)],
  [
    new Point(350, 100),
    new Point(200, 100),
    new Point(150, 150),
    new Point(200, 150),
  ],
  [
    new Point(400, 100),
    new Point(600, 100),
    new Point(600, 300),
    new Point(400, 300),
  ],
].map((points) => new Polygon(points, colors[i++], colors[i++]));
const circles = [new Circle(400, 400, 50), new Circle(500, 500, 50)];

const shapes = polygons.concat(circles).concat(longmaoShape).concat(rectShape);

function redraw() {
  shapes.forEach((p) => {
    p.fill(ctx);
    p.stroke(ctx);
  });
}

let movingShape = null;
let isMoving = false;

function resetMovingVariables() {
  movingShape = null;
  isMoving = false;
}

function updateMovingShape(x, y) {
  for (const p of shapes) {
    p.createPath(ctx);
    if (ctx.isPointInPath(x, y)) {
      movingShape = p;
      break;
    }
  }
}

function bindEvents() {
  canvas.addEventListener("click", ({ offsetX, offsetY }) => {
    isMoving = !isMoving;
    updateMovingShape(offsetX, offsetY);

    if (isMoving && movingShape) {
      startAnimation();
    } else {
      stopAnimation();
    }
  });
}

/**
 *
 * @param {MinimumTranslationVector} mtv
 */
function separate(mtv) {
  if (!mtv.axis) {
    mtv.axis = new Vector(velocity.x, velocity.y).normalize();
  }

  let dx = mtv.axis.x * mtv.overlap;
  let dy = mtv.axis.y * mtv.overlap;

  if (dx * velocity.x > 0) {
    dx = -dx;
  }
  if (dy * velocity.y > 0) {
    dy = -dy;
  }

  movingShape.move(dx, dy);
}

/**
 *
 * @param {MinimumTranslationVector} mtv
 * @param {Shape} collider
 * @param {Shape} collidee
 */
function fixMTVAxisDirection(mtv, collider, collidee) {
  if (!mtv.axis) {
    return;
  }

  const d = new Vector(collider.center()).edge(collidee.center());
  // cos(θ) 的值大于0 说明夹角在 0-90 度，同向
  if (d.dotProduct(mtv.axis) > 0) {
    mtv.axis.x = -mtv.axis.x;
    mtv.axis.y = -mtv.axis.y;
  }
}

/**
 * 将移动的图形移动到碰撞的边界，反弹回去
 *
 * @param {MinimumTranslationVector} mtv
 * @param {Shape} collider
 * @param {Shape} collidee
 */
function bounce(mtv, collider, collidee) {
  const velocityVector = new Vector(velocity.x, velocity.y);
  const velocityUnitVector = velocityVector.normalize();
  const velocityMagnitude = velocityVector.magnitude();

  fixMTVAxisDirection(mtv, collider, collidee);

  const perpendicular = mtv.axis
    ? mtv.axis.perpendicular()
    : velocityVector.normal();

  separate(mtv);

  // θoutgoing = 2 × (V ⋅ L) / (L ⋅ L) × L – V
  const vDotL = velocityUnitVector.dotProduct(perpendicular);
  const lDotL = perpendicular.dotProduct(perpendicular);
  const ratio = vDotL / lDotL;

  velocity.x =
    (2 * ratio * perpendicular.x - velocityUnitVector.x) * velocityMagnitude;
  velocity.y =
    (2 * ratio * perpendicular.y - velocityUnitVector.y) * velocityMagnitude;
}

function handleCollision() {
  for (const shape of shapes) {
    if (shape === movingShape) {
      continue;
    }

    const mtv = movingShape.collidesWith(shape);
    if (mtv.overlap !== 0) {
      bounce(mtv, movingShape, shape);
    }
  }
}

function handleOutFfBound() {
  if (!movingShape) {
    return;
  }

  const { left, top, width, height } = movingShape.getBoundingBox();
  if (left < 0 || left + width > canvas.width) {
    velocity.x = -velocity.x;
  }
  if (top < 0 || top + height > canvas.height) {
    velocity.y = -velocity.y;
  }
}

const timer = new AnimationTimer();
let lastFrameTime = performance.now();
function animate(time) {
  if (!timer.isRunning()) {
    return;
  }

  const elapsed = time - lastFrameTime;
  lastFrameTime = time;
  const fps = 1000 / elapsed;
  const dx = velocity.x / fps;
  const dy = velocity.y / fps;
  movingShape.move(dx, dy);
  handleOutFfBound();
  handleCollision();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  redraw();

  requestAnimationFrame(animate);
}

function startAnimation() {
  lastFrameTime = performance.now();
  timer.start();

  requestAnimationFrame(animate);
}

function stopAnimation() {
  timer.stop();
  timer.reset();

  resetMovingVariables();
}

bindEvents();
redraw();

ctx.fillStyle = "cornflowerblue";
ctx.font = "24px Arial";
ctx.fillText("Click on a shape to animate it", 20, 40);
ctx.fillText("Click on the background to stop animating", 20, 65);
