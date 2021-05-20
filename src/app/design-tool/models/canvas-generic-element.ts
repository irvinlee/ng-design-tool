import { Dimensions } from './../types/dimensions';
import { Coordinates } from './../types/coordinates';

export abstract class CanvasGenericElement {
  coordinates = {top: 100, left: 100} as Coordinates;
  dimensions = {} as Dimensions;

  constructor() {}

  get height(): number {
    return this.dimensions?.height || 0;
  }

  set height(newHeight: number) {
    this.dimensions.height = newHeight;
  }

  get width(): number {
    return this.dimensions?.width || 0;
  }

  set width(newWidth: number) {
    this.dimensions.width = newWidth;
  }

  checkIsHovered(mouseX: number, mouseY: number): boolean {
    return mouseX >= this.coordinates.left - 5 &&
          mouseX <= this.coordinates.left + this.width + 10 &&
          mouseY >= this.coordinates.top - 5 &&
          mouseY <= this.coordinates.top + this.height + 10;
  }
}
