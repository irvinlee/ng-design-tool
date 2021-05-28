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
  let theta = Math.atan2(x2 - x1, y2 - y1);

  if (theta < 0) {
    theta += TWOPI;
  }

  return RAD2DEG * theta;
}

export function getRotationHandlePosition(x: number, y: number, width: number, height: number): {top: number, left: number} {
  return {
    top: y - 20,
    left: x + (width / 2)
  };
}
