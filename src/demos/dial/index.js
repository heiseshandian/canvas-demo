// 获取 Canvas 上下文
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 480;

function drawGrid(stepX = 10, stepY = 10, color = "#bbb") {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;

  for (let x = 0.5; x < canvas.width; x += stepX) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0.5; y < canvas.height; y += stepY) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const outerRadius = 200;
const ringSize = 20;
const longTickSize = 10;
const shortTickSize = 5;
const innerRadius = outerRadius - ringSize - longTickSize;

function drawOuterRing() {
  ctx.save();

  ctx.beginPath();
  ctx.fillStyle = "rgba(100, 140, 230, 0.1)";
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.arc(centerX, centerY, outerRadius - ringSize, 0, Math.PI * 2, true);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = "rgba(100, 140, 230, 1)";
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius - ringSize, 0, Math.PI * 2, true);
  ctx.stroke();

  ctx.restore();
}

function drawInnerCircle() {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = "#bbb";
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawTicks() {
  ctx.save();
  ctx.translate(centerX, centerY);

  const radius = outerRadius - ringSize;
  const long = radius - longTickSize;
  const short = radius - shortTickSize;
  for (let i = 0; i < 360; i += 5) {
    const angle = (Math.PI / 180) * i;
    ctx.beginPath();
    ctx.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));

    if (i % 2 === 0) {
      ctx.lineTo(long * Math.cos(angle), long * Math.sin(angle));
    } else {
      ctx.lineTo(short * Math.cos(angle), short * Math.sin(angle));
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawNumbers() {
  ctx.save();
  ctx.translate(centerX, centerY);

  ctx.font = "14px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "blue";

  const radius = innerRadius - 10;
  for (let i = 0; i < 360; i += 30) {
    const angle = (Math.PI / 180) * i;
    ctx.fillText(i, radius * Math.cos(angle), radius * Math.sin(angle));
  }

  ctx.restore();
}

function drawAnnotations() {
  ctx.save();
  ctx.translate(centerX, centerY);

  ctx.fillStyle = "rgba(80, 190, 240, 0.6)";
  ctx.strokeStyle = "#bbb";
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const angle = (Math.PI / 180) * -45;
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
