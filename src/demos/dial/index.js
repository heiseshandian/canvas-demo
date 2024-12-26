// 获取 Canvas 上下文

import { AnimationTimer } from "../shared/animation-timer.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const offscreenCanvas = document.createElement("canvas");
const offscreenCtx = offscreenCanvas.getContext("2d");

canvas.width = 600;
canvas.height = 480;

offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

function drawGrid(stepX = 10, stepY = 10, color = "#bbb") {
  offscreenCtx.save();
  offscreenCtx.strokeStyle = color;
  offscreenCtx.lineWidth = 0.5;

  for (let x = 0.5; x < canvas.width; x += stepX) {
    offscreenCtx.beginPath();
    offscreenCtx.moveTo(x, 0);
    offscreenCtx.lineTo(x, canvas.height);
    offscreenCtx.stroke();
  }

  for (let y = 0.5; y < canvas.height; y += stepY) {
    offscreenCtx.beginPath();
    offscreenCtx.moveTo(0, y);
    offscreenCtx.lineTo(canvas.width, y);
    offscreenCtx.stroke();
  }
  offscreenCtx.restore();
}

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const outerRadius = 200;
const ringSize = 20;
const longTickSize = 10;
const shortTickSize = 5;
const innerRadius = outerRadius - ringSize - longTickSize;

function drawOuterRing() {
  offscreenCtx.save();

  offscreenCtx.beginPath();
  offscreenCtx.fillStyle = "rgba(100, 140, 230, 0.1)";
  offscreenCtx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  offscreenCtx.arc(
    centerX,
    centerY,
    outerRadius - ringSize,
    0,
    Math.PI * 2,
    true
  );
  offscreenCtx.fill();

  offscreenCtx.beginPath();
  offscreenCtx.strokeStyle = "rgba(100, 140, 230, 1)";
  offscreenCtx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  offscreenCtx.stroke();
  offscreenCtx.beginPath();
  offscreenCtx.arc(
    centerX,
    centerY,
    outerRadius - ringSize,
    0,
    Math.PI * 2,
    true
  );
  offscreenCtx.stroke();

  offscreenCtx.restore();
}

function drawInnerCircle() {
  offscreenCtx.save();
  offscreenCtx.beginPath();
  offscreenCtx.strokeStyle = "#bbb";
  offscreenCtx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
  offscreenCtx.stroke();
  offscreenCtx.restore();
}

function drawTicks() {
  offscreenCtx.save();
  offscreenCtx.translate(centerX, centerY);

  const radius = outerRadius - ringSize;
  const long = radius - longTickSize;
  const short = radius - shortTickSize;
  for (let i = 0; i < 360; i += 5) {
    const angle = (Math.PI / 180) * i;
    offscreenCtx.beginPath();
    offscreenCtx.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));

    if (i % 2 === 0) {
      offscreenCtx.lineTo(long * Math.cos(angle), long * Math.sin(angle));
    } else {
      offscreenCtx.lineTo(short * Math.cos(angle), short * Math.sin(angle));
    }

    offscreenCtx.stroke();
  }

  offscreenCtx.restore();
}

function drawNumbers() {
  offscreenCtx.save();
  offscreenCtx.translate(centerX, centerY);

  offscreenCtx.font = "14px serif";
  offscreenCtx.textAlign = "center";
  offscreenCtx.textBaseline = "middle";
  offscreenCtx.fillStyle = "blue";

  const radius = innerRadius - 10;
  for (let i = 0; i < 360; i += 30) {
    const angle = (Math.PI / 180) * i;
    offscreenCtx.fillText(
      i,
      radius * Math.cos(angle),
      radius * Math.sin(angle)
    );
  }

  offscreenCtx.restore();
}

function drawAnnotations() {
  offscreenCtx.save();
  offscreenCtx.translate(centerX, centerY);

  offscreenCtx.fillStyle = "rgba(80, 190, 240, 0.6)";
  offscreenCtx.strokeStyle = "#bbb";
  offscreenCtx.beginPath();
  offscreenCtx.arc(0, 0, 10, 0, Math.PI * 2);
  offscreenCtx.fill();
  offscreenCtx.stroke();

  offscreenCtx.restore();
}

function drawMovingAngles(angle = (Math.PI / 180) * -45) {
  ctx.save();
  ctx.translate(centerX, centerY);
  const outerCenterX = outerRadius * Math.cos(angle);
  const outerCenterY = outerRadius * Math.sin(angle);

  ctx.beginPath();
  ctx.strokeStyle = "#aaa";
  ctx.moveTo(0, 0);
  ctx.lineTo(outerCenterX, outerCenterY);
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = "rgba(250, 250, 0, 0.6)";
  ctx.arc(outerCenterX, outerCenterY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawDial() {
  drawOuterRing();
  drawInnerCircle();
  drawTicks();
  drawNumbers();
  drawAnnotations();
}

function draw() {
  drawGrid();
  drawDial();
}
draw();

function fixBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(offscreenCanvas, 0, 0);
}

const duration = 30 * 1000;
let velocity = Math.PI / duration;
const timer = new AnimationTimer(() => {
  fixBackground();
  const elapsed = Math.min(duration, timer.getElapsedTime());
  drawMovingAngles(elapsed * velocity);
}, duration);

timer.start();
