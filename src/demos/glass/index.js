/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const resetBtn = document.getElementById("resetBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const img = new Image();
img.onload = () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};
img.src = "./countrypath.jpg";

let isDrawing = false;
let imgData = null;
let mouseDownPosition = null;
let selectedRect = null;

function resetVariables() {
  isDrawing = false;
  imgData = null;
  mouseDownPosition = null;
  selectedRect = null;
}

function saveDrawingSurface() {
  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreDrawingSurface() {
  ctx.putImageData(imgData, 0, 0);
}

function bindEvents() {
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const { offsetX, offsetY } = e;
    mouseDownPosition = { offsetX, offsetY };
    saveDrawingSurface();
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    restoreDrawingSurface();
    const { offsetX, offsetY } = e;
    const width = offsetX - mouseDownPosition.offsetX;
    const height = offsetY - mouseDownPosition.offsetY;
    ctx.strokeRect(
      mouseDownPosition.offsetX,
      mouseDownPosition.offsetY,
      width,
      height
    );
  });

  canvas.addEventListener("mouseup", (e) => {
    isDrawing = false;
    const { offsetX, offsetY } = e;
    const width = offsetX - mouseDownPosition.offsetX - ctx.lineWidth * 4;
    const height = offsetY - mouseDownPosition.offsetY - ctx.lineWidth * 4;
    selectedRect = {
      x: mouseDownPosition.offsetX + ctx.lineWidth * 2,
      y: mouseDownPosition.offsetY + ctx.lineWidth * 2,
      width,
      height,
    };

    const imageData = ctx.getImageData(
      selectedRect.x,
      selectedRect.y,
      selectedRect.width,
      selectedRect.height
    );
    restoreDrawingSurface();
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the original canvas
    ctx.putImageData(imageData, 0, 0); // Draw the selected imageData
    ctx.drawImage(
      canvas,
      0,
      0,
      selectedRect.width,
      selectedRect.height,
      0,
      0,
      canvas.width,
      canvas.height
    ); // Stretch the selected imageData to cover the whole canvas
    resetVariables();
  });

  resetBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  });
}

bindEvents();
