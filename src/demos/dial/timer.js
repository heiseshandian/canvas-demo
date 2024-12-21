export class Timer {
  constructor(duration) {
    this.duration = duration;
    this.startTime = null;
    this.animationFrameId = null;
  }

  start(callback) {
    this.startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - this.startTime;
      if (elapsed < this.duration) {
        callback(elapsed);
        this.animationFrameId = requestAnimationFrame(tick);
      } else {
        callback(this.duration);
        this.stop();
      }
    };
    tick();
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
