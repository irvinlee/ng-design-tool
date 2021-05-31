export function generateRandomId(): string {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

export function getBearing(x1: number, y1: number, x2: number, y2: number): number {
  const TWOPI = 6.2831853071795865;
  const RAD2DEG = 57.2957795130823209;
  let theta = Math.atan2(x2 - x1, y1 - y2);

  if (theta < 0) {
    theta += TWOPI;
  }

  return RAD2DEG * theta;
}

export function degToRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

export function getRotationHandlePosition(x: number, y: number, width: number, height: number): {top: number, left: number} {
  return {
    top: y - 20,
    left: x + (width / 2)
  };
}

export function getCoordinatesAfterRotation(
  x: number,
  y: number,
  bearing: number,
  pivotPointX = 0,
  pivotPointY = 0
): {x: number, y: number} {
  const bearingRad = degToRad(bearing);

  return {
    x: (x - pivotPointX) * Math.cos(bearingRad) - (y - pivotPointY)  * Math.sin(bearingRad) + pivotPointX,
    y: (y - pivotPointY) * Math.cos(bearingRad) + (x - pivotPointX) * Math.sin(bearingRad) + pivotPointY,
  };
}

export function getRelativeCursorCoordinates(event: MouseEvent): {x: number, y: number} {
  const target = event.target as HTMLCanvasElement;
  return {
    x: event.clientX - target.offsetLeft,
    y: event.clientY - target.offsetTop,
  };
}
