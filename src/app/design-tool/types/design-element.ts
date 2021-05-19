import { Coordinates } from './coordinates';

export abstract class DesignElement {
  isHovered = false;
  isSelected = false;
  metrics = {} as TextMetrics;
  coordinates = {top: 100, left: 100} as Coordinates;
  zInddex = 0;

  constructor() {}

  checkIsHovered(mouseX: number, mouseY: number): boolean {
    return mouseX >= this.coordinates.left - 5 &&
          mouseX <= this.coordinates.left + this.metrics.width + 10 &&
          mouseY >= this.coordinates.top - this.metrics.actualBoundingBoxAscent - 5 &&
          mouseY <= this.coordinates.top;
  }

  abstract renderToCanvas(canvasContext: CanvasRenderingContext2D): void;
}
