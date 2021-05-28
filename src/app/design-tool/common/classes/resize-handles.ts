import { getCoordinatesAfterRotation, getRotationHandlePosition } from '../utils';
import { MouseHandle } from './mouse-handle';

export class ResizeHandles {
  topLeftHandle = new MouseHandle(undefined, 'nwse-resize');
  topRightHandle = new MouseHandle(undefined, 'nesw-resize');
  bottomLeftHandle = new MouseHandle(undefined, 'nesw-resize');
  bottomRightHandle = new MouseHandle(undefined, 'nwse-resize');
  rotateHandle = new MouseHandle(undefined, 'grab');

  setPosition(x: number, y: number, width: number, height: number, bearing: number): void{
    const midPointX = (x + width / 2);
    const midPointY = (y + height / 2);

    const topLeftCoords = getCoordinatesAfterRotation(x, y, bearing, midPointX, midPointY);
    const topRightCoords = getCoordinatesAfterRotation(x + width, y, bearing, midPointX, midPointY);
    const bottomLeftCoords = getCoordinatesAfterRotation(x, y + height, bearing, midPointX, midPointY);
    const bottomRightCoords = getCoordinatesAfterRotation(x + width, y + height, bearing, midPointX, midPointY);

    this.topLeftHandle.left = topLeftCoords.x;
    this.topLeftHandle.top = topLeftCoords.y;

    this.topRightHandle.left = topRightCoords.x;
    this.topRightHandle.top = topRightCoords.y;

    this.bottomLeftHandle.left = bottomLeftCoords.x;
    this.bottomLeftHandle.top = bottomLeftCoords.y;

    this.bottomRightHandle.left = bottomRightCoords.x;
    this.bottomRightHandle.top = bottomRightCoords.y;

    const zeroDegrees = getRotationHandlePosition(x, y, width, height);
    const rotationHandlePosition = getCoordinatesAfterRotation(zeroDegrees.left, zeroDegrees.top, bearing, midPointX, midPointY);

    this.rotateHandle.left = rotationHandlePosition.x;
    this.rotateHandle.top = rotationHandlePosition.y;
  }

  render(canvasContext: CanvasRenderingContext2D): void {
    this.topLeftHandle.render(canvasContext);
    this.topRightHandle.render(canvasContext);
    this.bottomLeftHandle.render(canvasContext);
    this.bottomRightHandle.render(canvasContext);
    this.rotateHandle.render(canvasContext);
  }

  setParentCanvas(canvas: HTMLCanvasElement | undefined): void {
    this.topLeftHandle.bindToCanvasElement(canvas);
    this.topRightHandle.bindToCanvasElement(canvas);
    this.bottomLeftHandle.bindToCanvasElement(canvas);
    this.bottomRightHandle.bindToCanvasElement(canvas);
    this.rotateHandle.bindToCanvasElement(canvas);
  }
}
