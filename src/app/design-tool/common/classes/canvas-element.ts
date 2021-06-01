import { CanvasMouseEvent } from './../../types/canvas-mouse-event';
import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';

const DEFAULT_TOP = 100;
const DEFAULT_LEFT = 200;

export abstract class CanvasElement {
  // tslint:disable-next-line:variable-name
  private _coordinates = {} as Coordinates;
  // tslint:disable-next-line:variable-name
  private _dimensions = {} as Dimensions;

  protected parentCanvasElement: HTMLCanvasElement | undefined;

  zIndex = 0;
  isHovered = false;
  zoomLevel = 1;

  constructor(coordinates?: Coordinates, dimensions?: Dimensions, isHovered = false, zIndex = 0, zoomLevel = 1) {
    this._coordinates = {top: coordinates?.top || DEFAULT_TOP, left: coordinates?.left || DEFAULT_LEFT};
    this._dimensions = {width: dimensions?.width, height: dimensions?.height};
    this.isHovered = isHovered;
    this.zIndex = zIndex;
    this.zoomLevel = zoomLevel;
  }

  get height(): number | undefined {
    return (this._dimensions.height || 0) * this.zoomLevel;
  }

  set height(newHeight: number | undefined) {
    this._dimensions.height = newHeight;
  }

  get width(): number | undefined {
    console.log(this._dimensions.width);
    console.log(this.zoomLevel);
    return (this._dimensions.width || 0) * this.zoomLevel;
  }

  set width(newWidth: number | undefined) {
    this._dimensions.width = newWidth;
  }

  get top(): number | undefined{
    return (this._coordinates.top || 0) * this.zoomLevel;
  }

  set top(newTop: number | undefined) {
    this._coordinates.top = newTop;
  }

  get left(): number | undefined{
    return (this._coordinates.left || 0) * this.zoomLevel;
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
          mouseY >= (this.top as number) - 10 &&
          mouseY <= (this.top as number) + (this.height as number) + 10;
  }

  handleMouseEvent(canvasMouseEvent: CanvasMouseEvent): void {
    const {type} = canvasMouseEvent;

    switch (type) {
      case 'click':
        this.onClick(canvasMouseEvent);
        break;
      case 'mousemove':
        this.onMouseMove(canvasMouseEvent);
        break;
      case 'drag':
        this.onDrag(canvasMouseEvent);
        break;
      case 'resize':
        this.onDrag(canvasMouseEvent);
        break;
      case 'rotate':
        this.onDrag(canvasMouseEvent);
        break;
      case 'drop':
        this.onDrop(canvasMouseEvent);
        break;
      case 'mouseout':
        this.onMouseOut(canvasMouseEvent);
        break;
    }
  }

  abstract onClick(canvasMouseEvent: CanvasMouseEvent): void;
  abstract onMouseMove(canvasMouseEvent: CanvasMouseEvent): void;
  abstract onMouseOut(canvasMouseEvent: CanvasMouseEvent): void;
  abstract onDrag(canvasMouseEvent: CanvasMouseEvent): void;
  abstract onDrop(canvasMouseEvent: CanvasMouseEvent): void;
}
