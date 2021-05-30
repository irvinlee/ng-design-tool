import { CanvasMouseEvent } from './../../types/canvas-mouse-event';
import { Observable, Subscription } from 'rxjs';
import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';
import { getRelativeCursorCoordinates } from '../utils';

const DEFAULT_TOP = 100;
const DEFAULT_LEFT = 200;

export abstract class CanvasElement {
  // tslint:disable-next-line:variable-name
  private _coordinates = {} as Coordinates;
  // tslint:disable-next-line:variable-name
  private _dimensions = {} as Dimensions;

  private hasTriggeredMouseDownEvent = false;
  private hasTriggeredDragEvent = false;
  private mouseSubscription?: Subscription;
  private lastMouseDownTimestamp: number | undefined;

  protected parentCanvasElement: HTMLCanvasElement | undefined;

  zIndex = 0;
  isHovered = false;

  constructor(coordinates?: Coordinates, dimensions?: Dimensions, isHovered = false, zIndex = 0) {
    this._coordinates = {top: coordinates?.top || DEFAULT_TOP, left: coordinates?.left || DEFAULT_LEFT};
    this._dimensions = {width: dimensions?.width, height: dimensions?.height};
    this.isHovered = isHovered;
    this.zIndex = zIndex;
  }

  get height(): number | undefined {
    return this._dimensions.height || 0;
  }

  set height(newHeight: number | undefined) {
    this._dimensions.height = newHeight;
  }

  get width(): number | undefined {
    return this._dimensions.width || 0;
  }

  set width(newWidth: number | undefined) {
    this._dimensions.width = newWidth;
  }

  get top(): number | undefined{
    return this._coordinates.top;
  }

  set top(newTop: number | undefined) {
    this._coordinates.top = newTop;
  }

  get left(): number | undefined{
    return this._coordinates.left;
  }

  set left(newLeft: number | undefined) {
    this._coordinates.left = newLeft;
  }

  get hasCoordinates(): boolean {
    return this.left !== undefined && this.top !== undefined;
  }

  get hasDimensions(): boolean {
    return this.width !== undefined && this.height !== undefined;
  }

  get dimensions(): Dimensions {
    return {...this._dimensions};
  }

  get coordinates(): Coordinates {
    return {...this._coordinates};
  }

  bindToCanvasElement(canvas: HTMLCanvasElement | undefined): void {
    this.parentCanvasElement = canvas;
  }

  checkIsHovered(mouseX: number, mouseY: number): boolean {
    if (!this.hasCoordinates) {
      return false;
    }

    return mouseX >= (this.left as number) - 5 &&
          mouseX <= (this.left as number) + (this.width as number) + 10 &&
          mouseY >= (this.top as number) - 15 &&
          mouseY <= (this.top as number) + (this.height as number) + 10;
  }

  handleMouseEvent(canvasMouseEvent: CanvasMouseEvent): void {
    const {type} = canvasMouseEvent;

    switch (type) {
      case 'mousemove':
        this.isHovered = true;

        if (this.hasTriggeredMouseDownEvent) {
          this.hasTriggeredDragEvent = true;
          this.onDrag(canvasMouseEvent);
        } else {
          this.onMouseMove(canvasMouseEvent);
        }
        break;
      case 'mouseup':
        // if the user held the mouse for less than 150ms, we'll consider it a click..
        if (Date.now() - (this.lastMouseDownTimestamp as number) < 150) {
          this.onClick(canvasMouseEvent);
          this.hasTriggeredMouseDownEvent = false;
        } else {
          this.hasTriggeredMouseDownEvent = false;
          if (this.hasTriggeredDragEvent) {
            this.onDrop(canvasMouseEvent);
            // end drag...
            this.hasTriggeredDragEvent = false;
          } else {
            this.onMouseUp(canvasMouseEvent);
          }
        }
        this.lastMouseDownTimestamp = undefined;
        break;
      case 'mousedown':
        this.hasTriggeredMouseDownEvent = true;
        this.lastMouseDownTimestamp = Date.now();
        this.onMouseDown(canvasMouseEvent);
        break;
      case 'mouseout':
        this.isHovered = false;
        this.onMouseOut(canvasMouseEvent);
        break;
    }
  }

  abstract onClick(canvasMouseEvent: CanvasMouseEvent): void;
  abstract onMouseMove(canvasMouseEvent: CanvasMouseEvent): void;
  abstract onMouseOut(canvasMouseEvent: CanvasMouseEvent): void;
  abstract onMouseUp(canvasMouseEvent: CanvasMouseEvent): void;
  abstract onMouseDown(canvasMouseEvent: CanvasMouseEvent): void;
  abstract onDrag(canvasMouseEvent: CanvasMouseEvent): void;
  abstract onDrop(canvasMouseEvent: CanvasMouseEvent): void;
}
