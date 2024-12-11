/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/**
 * @type {HTMLInputElement}
 */
const guidewireCheckbox = document.getElementById("guidewireCheckbox");
/**
 * @type {HTMLInputElement}
 */
const strokeStyleSelect = document.getElementById("strokeStyleSelect");
const eraseAllButton = document.getElementById("eraseAllButton");

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
  if (!mouseDownPosition || !mouseMovePosition) {
    return;
  }

  const { offsetX: initX, offsetY: initY } = mouseDownPosition;
  const { offsetX, offsetY } = mouseMovePosition;

  ctx.beginPath();
  ctx.moveTo(initX, initY);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
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
    updateLines();
    updateGuideWires();
  });

  canvas.addEventListener("mouseup", (e) => {
    restoreDrawingSurface();
    updateLines();
    resetDrawingVariables();
  });

  strokeStyleSelect.addEventListener("change", (e) => {
    ctx.strokeStyle = e.target.value;
  });

  eraseAllButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
  });
}

drawGrid();
bindEvents();

ctx.strokeStyle = strokeStyleSelect.value;
