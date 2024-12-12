// 获取 Canvas 上下文
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function rect(x, y, w, h, antiClockWise) {
  ctx.moveTo(x, y);
  const points = [
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
  if (antiClockWise) {
    points.reverse();
  }

  points.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.closePath();
}

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

function drawAxes() {
  // lines
  ctx.beginPath();
  ctx.moveTo(100, canvas.height - 100 + 2.5);
  ctx.lineTo(canvas.width - 100, canvas.height - 100 + 2.5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(100.5, canvas.height - 100 + 2.5);
  ctx.lineTo(100.5, 100);
  ctx.stroke();

  const y = canvas.height - 100 + 2.5;
  for (let x = 100.5 + 10; x <= canvas.width - 100; x += 10) {
    ctx.beginPath();
    if ((x - 100.5) % 50 === 0) {
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x, y + 10);
    } else {
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x, y + 4);
    }

    ctx.stroke();
  }

  const x = 100.5;
  const start = canvas.height - 100 + 2.5;
  for (let y = start - 10; y >= 100; y -= 10) {
    ctx.beginPath();
    if ((y - start) % 50 === 0) {
      ctx.moveTo(x - 10, y);
      ctx.lineTo(x + 10, y);
    } else {
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x + 4, y);
    }

    ctx.stroke();
  }
}

function drawArcs() {
  ctx.moveTo(100, 100);
  ctx.arc(200, 200, 100, 0, Math.PI);
  ctx.stroke();
}

function draw() {
  drawGrid();
  drawArcs();
}

draw();
