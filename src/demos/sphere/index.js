// 获取 Canvas 上下文
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

// 球的基本参数
const centerX = width / 2; // 圆心 X 坐标
const centerY = height / 2; // 圆心 Y 坐标
const radius = 150; // 半径

// 绘制渐变圆模拟立体球
function drawSphere() {
  // 创建径向渐变 (Radial Gradient)
  const gradient = ctx.createRadialGradient(
    centerX - radius / 3, // 光源 X 坐标
    centerY - radius / 3, // 光源 Y 坐标
    radius / 6, // 光源半径
    centerX, // 外圈 X 坐标
    centerY, // 外圈 Y 坐标
    radius // 外圈半径
  );

  // 定义渐变色
  gradient.addColorStop(0, "white"); // 光源颜色
  gradient.addColorStop(0.5, "#87CEFA"); // 中间颜色（球体主色）
  gradient.addColorStop(1, "#4682B4"); // 边缘阴影颜色

  // 绘制圆形
  ctx.save();
  ctx.beginPath();
  ctx.shadowColor = "black";
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 10;
  ctx.shadowBlur = 20;
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  // 绘制高光
  drawHighlight();
}

// 绘制高光效果
function drawHighlight() {
  const highlightX = centerX - radius / 3;
  const highlightY = centerY - radius / 3;

  ctx.beginPath();
  ctx.arc(highlightX, highlightY, radius / 10, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fill();
  ctx.closePath();
}

// 绘制立体球
drawSphere();
