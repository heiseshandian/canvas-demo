/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = 800;
canvas.height = 440;

const sky = new Image();
const grass = new Image();
const bigTree = new Image();
const smallTree = new Image();

const grassVelocity = 100;
const bigTreeVelocity = 80;
const smallTreeVelocity = 60;
const skyVelocity = 30;
let skyOffset = 0;
let grassOffset = 0;
let bigTreeOffset = 0;
let smallTreeOffset = 0;

function draw(fps = 1) {
  skyOffset = (skyOffset + skyVelocity / fps) % canvas.width;
  grassOffset = (grassOffset + grassVelocity / fps) % canvas.width;
  bigTreeOffset = (bigTreeOffset + bigTreeVelocity / fps) % canvas.width;
  smallTreeOffset = (smallTreeOffset + smallTreeVelocity / fps) % canvas.width;

  ctx.save();
  ctx.translate(-skyOffset, 0);
  ctx.drawImage(sky, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(sky, canvas.width - 2, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-smallTreeOffset, 0);
  ctx.drawImage(smallTree, 200, 280, 150, 150);
  ctx.drawImage(smallTree, 400, 280, 150, 150);
  ctx.drawImage(smallTree, 600, 280, 150, 150);
  ctx.drawImage(smallTree, 200 + canvas.width, 280, 150, 150);
  ctx.drawImage(smallTree, 400 + canvas.width, 280, 150, 150);
  ctx.drawImage(smallTree, 600 + canvas.width, 280, 150, 150);
  ctx.restore();

  ctx.save();
  ctx.translate(-bigTreeOffset, 0);
  ctx.drawImage(bigTree, 100, 250, 200, 200);
  ctx.drawImage(bigTree, 700, 250, 200, 200);
  ctx.drawImage(bigTree, 100 + canvas.width, 250, 200, 200);
  ctx.drawImage(bigTree, 700 + canvas.width, 250, 200, 200);
  ctx.restore();

  ctx.save();
  ctx.translate(-grassOffset, 0);
  ctx.drawImage(grass, 0, canvas.height - 50, canvas.width, 50);
  ctx.drawImage(grass, canvas.width, canvas.height - 50, canvas.width, 50);
  ctx.restore();
}

grass.src = "./grass.png";
bigTree.src = "./tree-twotrunks.png";
smallTree.src = "./smalltree.png";
sky.src = "./sky.png";

sky.onload = () => {
  draw();
};

let lastTime = performance.now();
function animate(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const fps = 1000 / (time - lastTime);
  lastTime = time;

  draw(fps);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
