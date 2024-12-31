import { Circle } from "../shared/circle.js";
import { Point } from "../shared/point.js";
import { Polygon } from "../shared/polygon.js";
import { Sprite } from "../shared/sprite.js";
import { ImagePainter } from "../shared/image-painter.js";
import { SpriteShape } from "../shared/sprite-shape.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

ctx.globalAlpha = 0.9;

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

let lastPosition = null;
let isMoving = false;
let movingShape = null;

function resetMovingVariables() {
  lastPosition = null;
  isMoving = false;
  movingShape = null;
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

function showCollisionMsg() {
  ctx.save();
  ctx.fillStyle = "red";
  ctx.font = "16px serif";
  ctx.fillText("collision detected", 50, 50);
  ctx.restore();
}

function detectCollision() {
  for (const p of shapes) {
    if (p !== movingShape) {
      const mtv = movingShape.collidesWith(p);
      if (mtv.overlap !== 0) {
        showCollisionMsg();
        break;
      }
    }
  }
}

function bindEvents() {
  canvas.addEventListener("mousedown", ({ offsetX, offsetY }) => {
    isMoving = true;
    lastPosition = { offsetX, offsetY };
    updateMovingShape(offsetX, offsetY);
  });

  canvas.addEventListener("mousemove", ({ offsetX, offsetY }) => {
    if (!isMoving || !movingShape) {
      return;
    }

    const deltaX = offsetX - lastPosition.offsetX;
    const deltaY = offsetY - lastPosition.offsetY;
    movingShape.move(deltaX, deltaY);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redraw();
    detectCollision();

    lastPosition = { offsetX, offsetY };
  });

  canvas.addEventListener("mouseup", () => {
    resetMovingVariables();
  });
}

bindEvents();
redraw();
