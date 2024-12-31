import { Vector } from "./vector.js";

export function polygonCollidesWithCircle(polygon, circle) {
  const points = polygon.points;
  let minDistance = Infinity;
  let closestPoint = null;
  points.forEach((p) => {
    const distance = Math.sqrt(
      Math.pow(circle.x - p.x, 2),
      Math.sqrt(circle.y - p.y, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = p;
    }
  });

  const edgeAxis = new Vector(circle.x, circle.y)
    .edge(new Vector(closestPoint.x, closestPoint.y))
    .normalize();
  const axes = polygon.getAxes().concat(edgeAxis);

  return !polygon.separationOnAxes(axes, circle);
}
