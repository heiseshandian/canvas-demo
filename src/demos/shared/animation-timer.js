export class AnimationTimer {
  /**
   *
   * @param {number} duration
   */
  constructor(duration = Infinity) {
    this.duration = duration;

    this.reset();
  }

  start() {
    if (!this.running) {
      this.startTime = performance.now() - this.elapsed;
      this.running = true;
    }
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

  reset() {
    this.startTime = null;
    this.elapsed = 0;
    this.running = false;
  }
}
