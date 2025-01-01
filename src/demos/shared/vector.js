export class Vector {
  constructor(xOrPoint, y) {
    if (xOrPoint && xOrPoint.x !== undefined) {
      this.x = xOrPoint.x;
      this.y = xOrPoint.y;
    } else {
      this.x = xOrPoint;
      this.y = y;
    }
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(vector) {
    const { x, y } = this;
    return new Vector(x + vector.x, y + vector.y);
  }

  subtract(vector) {
    const { x, y } = this;
    return new Vector(x - vector.x, y - vector.y);
  }

  dotProduct(vector) {
    const { x, y } = this;
    return x * vector.x + y * vector.y;
  }

  edge(vector) {
    return this.subtract(vector);
  }

  perpendicular() {
    const { x, y } = this;
    return new Vector(y, -x);
  }

  normalize() {
    const m = this.magnitude();
    if (m !== 0) {
      return new Vector(this.x / m, this.y / m);
    }
    return new Vector(0, 0);
  }

  normal() {
    const p = this.perpendicular();
    return p.normalize();
  }
}
