export class Shape {
  collidesWith(otherShape) {
    const axes = this.getAxes().concat(otherShape.getAxes());
    console.log("Testing collision with axes:", axes);

    const result = !this.separationOnAxes(axes, otherShape);
    console.log("Collision result:", result);
    return result;
  }

  separationOnAxes(axes, otherShape) {
    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      const p1 = this.project(axis);
      const p2 = otherShape.project(axis);

      console.log(`Axis ${i}:`, axis);
      console.log("Projection 1:", p1);
      console.log("Projection 2:", p2);
      console.log("Overlap:", p1.overlaps(p2));

      if (!p1.overlaps(p2)) {
        return true; // Found a separating axis
      }
    }
    return false; // No separating axis found
  }

  getAxes() {
    throw new Error("Should be implemented by the sub class");
  }

  project(axis) {
    throw new Error("Should be implemented by the sub class");
  }
}
