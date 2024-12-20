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

const imageDataCopy = ctx.createImageData(canvas.width, canvas.height);
