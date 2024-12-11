/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y, color, radius, speed, angle) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.speed = speed;
    this.angle = angle;
    this.life = 100;
  }

  update() {
    this.speed *= 0.98; // Gravity effect to slow particles down
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life -= 2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.createParticles();
  }

  createParticles() {
    const colors = ["#ff0044", "#00ff00", "#0000ff", "#ffcc00"];
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const radius = Math.random() * 3 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(
        new Particle(this.x, this.y, color, radius, speed, angle)
      );
    }
  }

  isFinished() {
    return this.particles.length === 0;
  }

  update() {
    this.particles.forEach((particle) => particle.update());
    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  draw() {
    this.particles.forEach((particle) => particle.draw());
  }
}

let fireworks = [];

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.05) {
    const x = Math.random() * canvas.width;
    const y = (Math.random() * canvas.height) / 2;
    fireworks.push(new Firework(x, y));
  }

  fireworks = fireworks.filter((f) => !f.isFinished());
  fireworks.forEach((firework) => {
    firework.update();
    firework.draw();
  });

  requestAnimationFrame(animate);
}

animate();
