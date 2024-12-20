/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const resetBtn = document.getElementById("resetBtn");
const negativeFilter = document.getElementById("negativeFilter");
const blackAndWhite = document.getElementById("blackAndWhite");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const img = new Image();
img.onload = () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};
img.src = "./countrypath.jpg";

let isDrawing = false;
/**
 * @type {ImageData}
 */
let imgData = null;
let mouseDownPosition = null;
let imageDataCopy = ctx.createImageData(canvas.width, canvas.height);

function resetVariables() {
  isDrawing = false;
  imgData = null;
  mouseDownPosition = null;
  imageDataCopy = ctx.createImageData(canvas.width, canvas.height);
}

function copyCanvasPixels() {
  for (let i = 0; i < imgData.data.length; i += 4) {
    imageDataCopy.data[i] = imgData.data[i];
    imageDataCopy.data[i + 1] = imgData.data[i + 1];
    imageDataCopy.data[i + 2] = imgData.data[i + 2];
    imageDataCopy.data[i + 3] = imgData.data[i + 3] / 10;
  }
}

function saveDrawingSurface() {
  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  copyCanvasPixels();
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

    restoreDrawingSurface();

    console.log(imageDataCopy);

    ctx.putImageData(
      imageDataCopy,
      0,
      0,
      mouseDownPosition.offsetX,
      mouseDownPosition.offsetY,
      width,
      height
    );
    resetVariables();
  });

  resetBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  });

  negativeFilter.addEventListener("click", () => {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = 255 - imgData.data[i];
      imgData.data[i + 1] = 255 - imgData.data[i + 1];
      imgData.data[i + 2] = 255 - imgData.data[i + 2];
    }
    ctx.putImageData(imgData, 0, 0);
  });

  blackAndWhite.addEventListener("click", () => {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const avg =
        (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
      imgData.data[i] = avg;
      imgData.data[i + 1] = avg;
      imgData.data[i + 2] = avg;
    }
    ctx.putImageData(imgData, 0, 0);
  });
}

bindEvents();
