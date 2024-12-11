/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
canvas.addEventListener("mousedown", (e) => {
  const { offsetX, offsetY } = e;
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);
});

canvas.addEventListener("mousemove", (e) => {
  e.preventDefault();
  if (!drawing) {
    return;
  }

  const { offsetX, offsetY } = e;
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
});
