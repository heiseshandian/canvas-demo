export class Projection {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  overlaps(projection) {
    return this.max > projection.min && projection.max > this.min;
  }

  overlap(projection) {
    if (!this.overlaps(projection)) {
      return 0;
    }

    return (
      Math.min(this.max, projection.max) - Math.max(this.min, projection.min)
    );
  }
}
