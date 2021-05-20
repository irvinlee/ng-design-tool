import { CanvasGenericElement } from './canvas-generic-element';

export class MouseHandle extends CanvasGenericElement {
  constructor() {
    super();
    this.dimensions.height = 8;
    this.dimensions.width = 8;
  }

  renderToCanvas(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.beginPath();
    canvasContext.rect(
      this.coordinates.left - this.width / 2,
      this.coordinates.top - this.height / 2,
      this.width,
      this.height
    );
    canvasContext.fillStyle = 'white';
    canvasContext.fill();
    canvasContext.stroke();
  }
}
