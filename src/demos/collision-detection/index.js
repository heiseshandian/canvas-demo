import { Point } from "../shared/point.js";
import { Polygon } from "../shared/polygon.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

ctx.globalAlpha = 0.9;

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

function redraw() {
  polygons.forEach((p) => {
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
  for (const p of polygons) {
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
  for (const p of polygons) {
    if (p !== movingShape && movingShape.collidesWith(p)) {
      showCollisionMsg();
      break;
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
