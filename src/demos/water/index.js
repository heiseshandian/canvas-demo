// 获取 Canvas 上下文
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configuration
const waveCount = 3;
const waveHeight = 50;
const waveLength = 200;
const speed = 0.05;
let time = 0;

function drawWave(yOffset, color) {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2 + yOffset);

  for (let x = 0; x <= canvas.width; x++) {
    const y =
      Math.sin(x / waveLength + time) * waveHeight +
      canvas.height / 2 +
      yOffset;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function animate() {
  time += speed;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw multiple layers of waves
  for (let i = 0; i < waveCount; i++) {
    const yOffset = i * 20 - 30; // Offset for each wave layer
    const color = `rgba(0, 119, 255, ${0.6 - i * 0.2})`; // Fading effect
    drawWave(yOffset, color);
  }

  requestAnimationFrame(animate);
}

animate();
