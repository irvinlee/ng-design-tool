import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';
import { CanvasElement } from './canvas-element';

export abstract class DesignElement extends CanvasElement{
  isHovered = false;
  isSelected = false;
  zIndex = 0;

  constructor(coordinates?: Coordinates, dimensions?: Dimensions, isHovered?: boolean, isSelected?: boolean, zIndex?: number) {
    super(coordinates, dimensions);
    this.isHovered = !!isHovered;
    this.isSelected = !!isSelected;
    this.zIndex = zIndex || 0;
  }

  displayOutline(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.beginPath();
    canvasContext.rect(
      (this.left as number) - 5,
      (this.top  as number) - 5,
      (this.width  as number) + 10,
      (this.height  as number) + 5
    );
    canvasContext.stroke();
  }

  abstract clone(): DesignElement;
  abstract render(canvasRef: HTMLCanvasElement): void;
}
