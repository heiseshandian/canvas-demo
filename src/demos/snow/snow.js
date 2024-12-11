/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const globalSnowflakes = [];

class Snowflake {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
  }

  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = -this.radius;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 初始化雪花
 *
 * @param {number} count 雪花个数
 */
function initSnowflakes(count = 100) {
  for (let i = 0; i < count; i++) {
    globalSnowflakes.push(
      new Snowflake(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 3 + 1,
        Math.random() * 1.5 + 0.5
      )
    );
  }
}

// 让雪花运动起来
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  globalSnowflakes.forEach((s) => {
    s.update();
    s.draw();
  });

  requestAnimationFrame(animate);
}

initSnowflakes();
animate();
