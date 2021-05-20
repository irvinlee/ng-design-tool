import { Dimensions } from './../types/dimensions';
import { Coordinates } from '../types/coordinates';

export abstract class DesignElement {
  isHovered = false;
  isSelected = false;

  coordinates = {top: 100, left: 100} as Coordinates;
  dimensions: Dimensions = {} as Dimensions;
  zIndex = 0;

  constructor() {}

  get height(): number {
    return this.dimensions?.height || 0;
  }

  get width(): number {
    return this.dimensions?.width || 0;
  }

  checkIsHovered(mouseX: number, mouseY: number): boolean {
    return mouseX >= this.coordinates.left - 5 &&
          mouseX <= this.coordinates.left + this.width + 10 &&
          mouseY >= this.coordinates.top - 5 &&
          mouseY <= this.coordinates.top + this.height + 10;
  }

  displayOutline(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.beginPath();
    canvasContext.rect(
      this.coordinates.left - 5,
      this.coordinates.top - 5,
      this.width + 10,
      this.height + 5
    );
    canvasContext.stroke();
  }

  abstract renderToCanvas(canvasContext: CanvasRenderingContext2D): void;
  abstract clone(): DesignElement;
}
