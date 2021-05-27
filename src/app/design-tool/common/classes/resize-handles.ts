import { MouseHandle } from './mouse-handle';

export class ResizeHandles {
  topLeftHandle = new MouseHandle(undefined, 'nwse-resize');
  topRightHandle = new MouseHandle(undefined, 'nesw-resize');
  bottomLeftHandle = new MouseHandle(undefined, 'nesw-resize');
  bottomRightHandle = new MouseHandle(undefined, 'nwse-resize');

  setPosition(x: number, y: number, width: number, height: number): void{
    this.topLeftHandle.left = x;
    this.topLeftHandle.top = y;

    this.topRightHandle.left = x + width;
    this.topRightHandle.top = y;

    this.bottomLeftHandle.left = x;
    this.bottomLeftHandle.top = y + height;

    this.bottomRightHandle.left = x + width;
    this.bottomRightHandle.top = y + height;
  }

  render(canvasContext: CanvasRenderingContext2D): void {
    this.topLeftHandle.render(canvasContext);
    this.topRightHandle.render(canvasContext);
    this.bottomLeftHandle.render(canvasContext);
    this.bottomRightHandle.render(canvasContext);
  }

  setParentCanvas(canvas: HTMLCanvasElement | undefined): void {
    this.topLeftHandle.bindToCanvasElement(canvas);
    this.topRightHandle.bindToCanvasElement(canvas);
    this.bottomLeftHandle.bindToCanvasElement(canvas);
    this.bottomRightHandle.bindToCanvasElement(canvas);
  }
}
