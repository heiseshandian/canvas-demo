/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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

function resetDrawingVariables() {
  drawingSurfaceImageData = null;
  isDrawing = false;
  mouseDownPosition = null;
  mouseMovePosition = null;
}

function saveDrawingSurface() {
  drawingSurfaceImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreDrawingSurface() {
  ctx.putImageData(drawingSurfaceImageData, 0, 0);
}

function updateLines() {
  const { offsetX: initX, offsetY: initY } = mouseDownPosition;
  const { offsetX, offsetY } = mouseMovePosition;

  ctx.beginPath();
  ctx.moveTo(initX, initY);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
}

function updateCircles() {
  const { offsetX: initX, offsetY: initY } = mouseDownPosition;
  const { offsetX, offsetY } = mouseMovePosition;

  const centerX = (initX + offsetX) / 2;
  const centerY = (initY + offsetY) / 2;
  const radius =
    Math.sqrt(
      Math.pow(Math.abs(offsetX - initX), 2) +
        Math.pow(Math.abs(offsetY - initY), 2)
    ) / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function updateRects() {
  const { offsetX: initX, offsetY: initY } = mouseDownPosition;
  const { offsetX, offsetY } = mouseMovePosition;

  ctx.beginPath();
  ctx.moveTo(initX, initY);
  ctx.lineTo(offsetX, initY);
  ctx.lineTo(offsetX, offsetY);
  ctx.lineTo(initX, offsetY);
  ctx.closePath();
  ctx.stroke();
}

function updatePolygons() {
  const { offsetX: initX, offsetY: initY } = mouseDownPosition;
  const { offsetX, offsetY } = mouseMovePosition;

  const centerX = (initX + offsetX) / 2;
  const centerY = (initY + offsetY) / 2;
  const radius =
    Math.sqrt(
      Math.pow(Math.abs(offsetX - initX), 2) +
        Math.pow(Math.abs(offsetY - initY), 2)
    ) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.translate(centerX, centerY);
  const sides = polygonSize.value;
  ctx.moveTo(radius * Math.cos(0), radius * Math.sin(0));
  for (let i = 1; i < sides; i++) {
    const angle = ((Math.PI * 2) / sides) * i;
    ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function updateShapes() {
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
  draw();
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
    isDrawing = true;

    mouseDownPosition = {
      offsetX,
      offsetY,
    };

    saveDrawingSurface();
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) {
      return;
    }

    const { offsetX, offsetY } = e;
    mouseMovePosition = {
      offsetX,
      offsetY,
    };

    restoreDrawingSurface();
    updateShapes();
    updateGuideWires();
  });

  canvas.addEventListener("mouseup", (e) => {
    restoreDrawingSurface();
    updateShapes();
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
