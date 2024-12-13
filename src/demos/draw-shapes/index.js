import { Polygon } from "./shapes/polygon.js";
import { Circle } from "./shapes/circle.js";
import { Line } from "./shapes/line.js";
import { Rect } from "./shapes/rect.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/**
 * @type {HTMLInputElement}
 */
const guidewireCheckbox = document.getElementById("guidewireCheckbox");
/**
 * @type {HTMLInputElement}
 */
const strokeStyleSelect = document.getElementById("strokeStyleSelect");
const eraseAllButton = document.getElementById("eraseAllButton");
/**
 * @type {HTMLInputElement}
 */
const shapeSelect = document.getElementById("shapeSelect");
const polygonSizeContainer = document.getElementById("polygonSizeContainer");
const polygonSize = document.getElementById("polygonSize");
const editModeCheckbox = document.getElementById("editModeCheckbox");

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

let drawingSurfaceImageData = null;
let isDrawing = false;
let mouseDownPosition = null;
let mouseMovePosition = null;

let isDragging = false;
let draggingShape = null;
let draggingOffsetX = null;
let draggingOffsetY = null;

function resetDrawingVariables() {
  drawingSurfaceImageData = null;
  isDrawing = false;
  mouseDownPosition = null;
  mouseMovePosition = null;

  isDragging = false;
  draggingShape = null;
  draggingOffsetX = null;
  draggingOffsetY = null;
}

function saveDrawingSurface() {
  drawingSurfaceImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreDrawingSurface() {
  ctx.putImageData(drawingSurfaceImageData, 0, 0);
}

const cachedShapes = {
  line: [],
  circle: [],
  rect: [],
  polygon: [],
};

function updateDraggingShape(offsetX, offsetY) {
  const selectedShape = shapeSelect.value;
  const shapes = cachedShapes[selectedShape];

  for (const shape of shapes) {
    shape.createPath(ctx);
    if (ctx.isPointInPath(offsetX, offsetY)) {
      draggingShape = shape;
      draggingOffsetX = offsetX - shape.x;
      draggingOffsetY = offsetY - shape.y;
      break;
    }
  }
}

function redrawAllCachedShapes() {
  Object.keys(cachedShapes).forEach((type) => {
    const shapes = cachedShapes[type];
    shapes.forEach((shape) => shape.stroke(ctx));
  });
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  redrawAllCachedShapes();
  drawGrid();
}

function updateLines(shouldCacheShapes) {
  const { offsetX: initX, offsetY: initY } = mouseDownPosition;
  const { offsetX, offsetY } = mouseMovePosition;

  const line = new Line(initX, initY, offsetX, offsetY, ctx.strokeStyle);
  line.stroke(ctx);

  if (shouldCacheShapes) {
    cachedShapes.line.push(line);
  }
}

function updateCircles(shouldCacheShapes) {
  const { offsetX: initX, offsetY: initY } = mouseDownPosition;
  const { offsetX, offsetY } = mouseMovePosition;

  const centerX = (initX + offsetX) / 2;
  const centerY = (initY + offsetY) / 2;
  const radius =
    Math.sqrt(
      Math.pow(Math.abs(offsetX - initX), 2) +
        Math.pow(Math.abs(offsetY - initY), 2)
    ) / 2;

  const circle = new Circle(centerX, centerY, radius, ctx.strokeStyle);
  circle.stroke(ctx);
  if (shouldCacheShapes) {
    cachedShapes.circle.push(circle);
  }
}

function updateRects(shouldCacheShapes) {
  const { offsetX: initX, offsetY: initY } = mouseDownPosition;
  const { offsetX, offsetY } = mouseMovePosition;

  const rect = new Rect(initX, initY, offsetX, offsetY, ctx.strokeStyle);
  rect.stroke(ctx);

  if (shouldCacheShapes) {
    cachedShapes.rect.push(rect);
  }
}

function updatePolygons(shouldCacheShapes) {
  const { offsetX: initX, offsetY: initY } = mouseDownPosition;
  const { offsetX, offsetY } = mouseMovePosition;

  const centerX = (initX + offsetX) / 2;
  const centerY = (initY + offsetY) / 2;
  const radius =
    Math.sqrt(
      Math.pow(Math.abs(offsetX - initX), 2) +
        Math.pow(Math.abs(offsetY - initY), 2)
    ) / 2;

  const polygon = new Polygon(
    centerX,
    centerY,
    radius,
    polygonSize.value,
    strokeStyleSelect.value
  );
  polygon.stroke(ctx);

  if (shouldCacheShapes) {
    cachedShapes.polygon.push(polygon);
  }
}

function updateShapes(shouldCacheShapes = false) {
  if (!mouseDownPosition || !mouseMovePosition) {
    return;
  }

  const shape = shapeSelect.value;
  const map = {
    line: updateLines,
    circle: updateCircles,
    rect: updateRects,
    polygon: updatePolygons,
  };

  const draw = map[shape] || map.line;
  draw(shouldCacheShapes);
}

function updateGuideWires() {
  if (!mouseMovePosition || !guidewireCheckbox.checked || !isDrawing) {
    return;
  }

  const { offsetX, offsetY } = mouseMovePosition;

  ctx.save();
  ctx.strokeStyle = "gray";

  ctx.beginPath();
  ctx.moveTo(offsetX + 0.5, 0);
  ctx.lineTo(offsetX + 0.5, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, offsetY + 0.5);
  ctx.lineTo(canvas.width, offsetY + 0.5);
  ctx.stroke();

  ctx.restore();
}

function showPolygonSizeContainer() {
  polygonSizeContainer.style.display = "inline-block";
}

function hidePolygonSizeContainer() {
  polygonSizeContainer.style.display = "none";
}

function bindEvents() {
  canvas.addEventListener("mousedown", (e) => {
    const { offsetX, offsetY } = e;
    mouseDownPosition = {
      offsetX,
      offsetY,
    };

    if (editModeCheckbox.checked) {
      isDragging = true;
      updateDraggingShape(offsetX, offsetY);
    } else {
      isDrawing = true;
      saveDrawingSurface();
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing && !isDragging) {
      return;
    }
    if (isDragging && !draggingShape) {
      return;
    }

    const { offsetX, offsetY } = e;
    mouseMovePosition = {
      offsetX,
      offsetY,
    };

    if (editModeCheckbox.checked) {
      draggingShape.move(offsetX - draggingOffsetX, offsetY - draggingOffsetY);
      redraw();
    } else {
      restoreDrawingSurface();
      updateShapes();
      updateGuideWires();
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (editModeCheckbox.checked) {
      redraw();
    } else {
      restoreDrawingSurface();
      updateShapes(true);
    }

    resetDrawingVariables();
  });

  strokeStyleSelect.addEventListener("change", (e) => {
    ctx.strokeStyle = e.target.value;
  });

  eraseAllButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
  });

  shapeSelect.addEventListener("change", (e) => {
    if (e.target.value === "polygon") {
      showPolygonSizeContainer();
    } else {
      hidePolygonSizeContainer();
    }
  });
}

drawGrid();
bindEvents();

ctx.strokeStyle = strokeStyleSelect.value;
