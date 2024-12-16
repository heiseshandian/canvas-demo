// 获取 Canvas 上下文
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawCirclerText(
  centerX,
  centerY,
  radius,
  txt,
  startAngle = 0,
  endAngle = Math.PI * 2
) {
  const angleIncrement = (endAngle - startAngle) / txt.length;
  let angle = startAngle;

  for (let i = 0; i < txt.length; i++) {
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 2 + angle);
    ctx.fillText(txt[i], 0, 0);
    ctx.restore();

    angle += angleIncrement;
  }
}

function draw() {
  ctx.font = "30px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  drawCirclerText(
    canvas.width / 2,
    canvas.height / 2,
    200,
    "Clockwise around the circle"
  );
}

draw();
