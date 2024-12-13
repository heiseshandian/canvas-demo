// 获取 Canvas 上下文
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  createPath() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
  }

  stroke() {
    ctx.save();
    this.createPath();
    ctx.stroke();
    ctx.restore();
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }
}

const cachedShapes = {
  points: [],
};

function drawPoints() {
  const points = [
    [100, 100],
    [400, 400],
    [400, 100],
    [100, 400],
  ];
  const pointShapes = points.map((p) => new Point(...p));
  pointShapes.forEach((p) => p.stroke());

  cachedShapes.points.push(...pointShapes);
}

function drawBezierCurves() {
  const {
    points: [start, end, ctrl1, ctrl2],
  } = cachedShapes;

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, end.x, end.y);
  ctx.stroke();
}

function redrawAllCachedShapes() {
  Object.keys(cachedShapes).forEach((type) => {
    const shapes = cachedShapes[type];
    shapes.forEach((shape) => shape.stroke(ctx));
  });

  drawBezierCurves();
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  redrawAllCachedShapes();
  drawGrid();
}

let mouseDownPosition = null;
let mouseMovePosition = null;
let isDragging = false;
let draggingPoint = null;
let draggingOffsetX = null;
let draggingOffsetY = null;

function resetDraggingVariables() {
  mouseDownPosition = null;
  mouseMovePosition = null;
  isDragging = false;
  draggingPoint = null;
  draggingOffsetX = null;
  draggingOffsetY = null;
}

function updateDraggingPoint(offsetX, offsetY) {
  const pointShapes = cachedShapes.points;
  for (let i = 0; i < pointShapes.length; i++) {
    const shape = pointShapes[i];
    shape.createPath();
    if (ctx.isPointInPath(offsetX, offsetY)) {
      draggingPoint = shape;
      draggingOffsetX = offsetX - shape.x;
      draggingOffsetY = offsetY - shape.y;
      break;
    }
  }
}

function bindEvents() {
  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;

    const { offsetX, offsetY } = e;
    mouseDownPosition = {
      offsetX,
      offsetY,
    };

    updateDraggingPoint(offsetX, offsetY);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging || !draggingPoint) {
      return;
    }

    const { offsetX, offsetY } = e;
    mouseMovePosition = {
      offsetX,
      offsetY,
    };

    draggingPoint.move(offsetX - draggingOffsetX, offsetY - draggingOffsetY);
    redraw();
  });

  canvas.addEventListener("mouseup", () => {
    if (isDragging) {
      redraw();
    }

    resetDraggingVariables();
  });
}

function draw() {
  drawGrid();
  drawPoints();
  drawBezierCurves();
}

draw();
bindEvents();
