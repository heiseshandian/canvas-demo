import type Canvas from "./canvas";

const WIDTH = 800;
const HEIGHT = 600;
const CLOCK_RADIUS = 100;
const NUMBER_RADIUS = CLOCK_RADIUS + 15;
const SECONDS_HAND_LEN = 90;
const HOURS_HAND_LEN = 70;
const TICK_LEN = 10;

export function drawClock(canvas: Canvas) {
  canvas.clearRect(0, 0, WIDTH, HEIGHT);

  canvas.save();
  canvas.translate(WIDTH / 2, HEIGHT / 2);

  drawCircles(canvas);
  drawNumbers(canvas);
  drawTicks(canvas);
  drawHands(canvas);
  drawTime(canvas);

  canvas.restore();
}

function drawCircles(canvas: Canvas) {
  canvas
    .beginPath()
    .arc(0, 0, 100, 0, Math.PI * 2)
    .stroke();

  canvas
    .beginPath()
    .arc(0, 0, 2, 0, Math.PI * 2)
    .fill();
}

function drawNumbers(canvas: Canvas) {
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  canvas.save().prop({
    font: "14px serif",
    textAlign: "center",
    textBaseline: "middle",
  });

  numbers.forEach((v) => {
    const angle = (Math.PI / 6) * (v - 3);

    canvas.fillText(
      v + "",
      NUMBER_RADIUS * Math.cos(angle),
      NUMBER_RADIUS * Math.sin(angle)
    );
  });

  canvas.restore();
}

function drawTicks(canvas: Canvas) {
  const ticks = Array.from({ length: 60 }, (_, i) => i + 1);

  ticks.forEach((t) => {
    const angle = (Math.PI / 30) * (t - 15);
    const isHoursTick = t % 5 === 0;
    const tickLen = isHoursTick ? TICK_LEN * 1.3 : TICK_LEN;

    canvas
      .beginPath()
      .prop({
        lineWidth: isHoursTick ? 2 : 1,
      })
      .line(
        (CLOCK_RADIUS - tickLen) * Math.cos(angle),
        (CLOCK_RADIUS - tickLen) * Math.sin(angle),
        CLOCK_RADIUS * Math.cos(angle),
        CLOCK_RADIUS * Math.sin(angle)
      );
  });
}

function drawHands(canvas: Canvas) {
  const [hours, minutes, seconds] = getTime();

  const secondsAngle = (Math.PI / 30) * seconds - Math.PI / 2;
  canvas
    .save()
    .beginPath()
    .prop("strokeStyle", "red")
    .line(
      0,
      0,
      SECONDS_HAND_LEN * Math.cos(secondsAngle),
      SECONDS_HAND_LEN * Math.sin(secondsAngle)
    )
    .restore();

  const minutesAngle = (Math.PI / 30) * (minutes + seconds / 60) - Math.PI / 2;
  canvas
    .beginPath()
    .line(
      0,
      0,
      SECONDS_HAND_LEN * Math.cos(minutesAngle),
      SECONDS_HAND_LEN * Math.sin(minutesAngle)
    );

  const hoursAngle =
    (Math.PI / 6) * ((hours % 12) + minutes / 60 + seconds / 3600) -
    Math.PI / 2;
  canvas
    .beginPath()
    .line(
      0,
      0,
      HOURS_HAND_LEN * Math.cos(hoursAngle),
      HOURS_HAND_LEN * Math.sin(hoursAngle)
    );
}

function getTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return [hours, minutes, seconds];
}

function drawTime(canvas: Canvas) {
  const [hours, minutes, seconds] = getTime().map((v) =>
    `${v}`.padStart(2, "0")
  );

  canvas
    .save()
    .prop({
      font: "20px monospace",
      textAlign: "center",
    })
    .fillText(`${hours}:${minutes}:${seconds}`, 0, NUMBER_RADIUS + 40)
    .restore();
}
