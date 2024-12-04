import Canvas from "./canvas";
import { drawClock } from "./demos/clock";
import "./style.css";

const WIDTH = 800;
const HEIGHT = 600;

function initCanvas() {
  const canvas = new Canvas(
    document.getElementById("canvas") as HTMLCanvasElement,
    1
  );
  canvas.size(WIDTH, HEIGHT);

  return canvas;
}

const canvas = initCanvas();
setInterval(() => {
  drawClock(canvas);
}, 1000);
