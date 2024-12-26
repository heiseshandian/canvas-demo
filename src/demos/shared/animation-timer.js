export class AnimationTimer {
  /**
   *
   * @param {function} onUpdate animation logic
   * @param {number} duration duration of the animation in milliseconds
   */
  constructor(onUpdate, duration) {
    this.duration = duration;
    this.onUpdate = onUpdate;

    this.reset();
  }

  start() {
    if (!this.running) {
      this.startTime = performance.now() - this.elapsed;
      this.running = true;
      this.tick();
    }
  }

  stop() {
    if (this.running) {
      this.running = false;
      this.elapsed = performance.now() - this.startTime;
    }
  }

  tick = () => {
    if (this.running) {
      this.elapsed = performance.now() - this.startTime;
      if (this.elapsed >= this.duration) {
        this.stop();
      }

      if (this.onUpdate) {
        this.onUpdate(this);
      }

      this.requestId = requestAnimationFrame(this.tick);
    }
  };

  getElapsedTime() {
    if (this.running) {
      return performance.now() - this.startTime;
    }

    return this.elapsed;
  }

  isOver() {
    return this.getElapsedTime() >= this.duration;
  }

  reset() {
    this.startTime = null;
    this.elapsed = 0;
    this.running = false;

    this.requestId = null;
  }
}
