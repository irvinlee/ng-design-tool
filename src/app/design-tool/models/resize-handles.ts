import { ElementMouseHandles } from './../types/element-mouse-handles.enum';
import { MouseHandle } from './mouse-handle';
export class ResizeHandles {
  private topLeftHandle = new MouseHandle();
  private topRightHandle = new MouseHandle();
  private bottomLeftHandle = new MouseHandle();
  private bottomRightHandle = new MouseHandle();

  constructor() {}

  setPosition(x: number, y: number, width: number, height: number): void{
    this.topLeftHandle.coordinates.left = x;
    this.topLeftHandle.coordinates.top = y;

    this.topRightHandle.coordinates.left = x + width;
    this.topRightHandle.coordinates.top = y;

    this.bottomLeftHandle.coordinates.left = x;
    this.bottomLeftHandle.coordinates.top = y + height;

    this.bottomRightHandle.coordinates.left = x + width;
    this.bottomRightHandle.coordinates.top = y + height;
  }

  renderToCanvas(canvasContext: CanvasRenderingContext2D): void {
    this.topLeftHandle.renderToCanvas(canvasContext);
    this.topRightHandle.renderToCanvas(canvasContext);
    this.bottomLeftHandle.renderToCanvas(canvasContext);
    this.bottomRightHandle.renderToCanvas(canvasContext);
  }

  getHoveredMouseHandle(mouseX: number, mouseY: number): string {
    if (this.topLeftHandle.checkIsHovered(mouseX, mouseY)) {
      return ElementMouseHandles.TOP_LEFT;
    }

    if (this.topRightHandle.checkIsHovered(mouseX, mouseY)) {
      return ElementMouseHandles.TOP_RIGHT;
    }

    if (this.bottomLeftHandle.checkIsHovered(mouseX, mouseY)) {
      return ElementMouseHandles.BOTTOM_LEFT;
    }

    if (this.bottomRightHandle.checkIsHovered(mouseX, mouseY)) {
      return ElementMouseHandles.BOTTOM_RIGHT;
    }

    return '';
  }
}
