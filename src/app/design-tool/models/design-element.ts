import { ResizeHandles } from './resize-handles';
import { CanvasGenericElement } from './canvas-generic-element';

export abstract class DesignElement extends CanvasGenericElement {
  isHovered = false;
  isSelected = false;
  zIndex = 0;
  resizeHandles: ResizeHandles | undefined;

  constructor() {
    super();
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

  displayResizeHandles(canvasContext: CanvasRenderingContext2D): void {
    this.resizeHandles = new ResizeHandles(this.coordinates.left - 5, this.coordinates.top - 5, this.width + 10, this.height + 5);
    this.resizeHandles.renderToCanvas(canvasContext);
  }

  abstract renderToCanvas(canvasContext: CanvasRenderingContext2D): void;
  abstract clone(): DesignElement;
}
