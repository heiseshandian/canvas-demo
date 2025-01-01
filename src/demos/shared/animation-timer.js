export class AnimationTimer {
  /**
   *
   * @param {number} duration
   */
  constructor(duration) {
    this.reset(duration);
  }

  start() {
    if (!this.running) {
      this.startTime = performance.now() - this.elapsed;
      this.running = true;
    }
  }

  isRunning() {
    return this.running;
  }

  stop() {
    if (this.running) {
      this.running = false;
      this.elapsed = performance.now() - this.startTime;
    }
  }

  getElapsedTime() {
    if (this.running) {
      return performance.now() - this.startTime;
    }

    return this.elapsed;
  }

  isOver() {
    return this.getElapsedTime() >= this.duration;
  }

  reset(duration = Infinity) {
    this.duration = duration;
    this.startTime = null;
    this.elapsed = 0;
    this.running = false;
  }
}
