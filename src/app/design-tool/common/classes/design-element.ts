import { CanvasMouseEvent } from './../../types/canvas-mouse-event';
import { ResizeHandles } from './resize-handles';
import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';
import { CanvasElement } from './canvas-element';

export abstract class DesignElement extends CanvasElement{
  // tslint:disable-next-line:variable-name
  private _isSelected = false;

  resizeHandles = new ResizeHandles();
  // tslint:disable-next-line:ban-types
  eventListeners: Map<string, Function> = new Map();
  bearing = 0;

  constructor(
    coordinates?: Coordinates,
    dimensions?: Dimensions,
    isHovered?: boolean,
    isSelected?: boolean,
    zIndex?: number,
    bearing?: number,
    // tslint:disable-next-line:ban-types
    eventListeners?: Map<string, Function>
  ) {
    super(coordinates, dimensions, isHovered, zIndex);
    this._isSelected = !!isSelected;
    this.zIndex = zIndex || 0;
    this.bearing = bearing || 0;

    if (eventListeners) {
      this.eventListeners = new Map(eventListeners);
    }
  }

  get isSelected(): boolean {
    return this._isSelected;
  }

  set isSelected(newVal: boolean) {
    this._isSelected = newVal;
  }

  setParentCanvas(canvas: HTMLCanvasElement | undefined): void {
    this.bindToCanvasElement(canvas);
    this.resizeHandles.setParentCanvas(canvas);
  }

  get midpointX(): number {
    return (this.left as number) + ((this.width as number) / 2);
  }

  get midpointY(): number {
    return (this.top as number) + ((this.height as number) / 2);
  }

  displayOutline(canvasContext: CanvasRenderingContext2D): void {
    const width = (this.width as number) + 10;
    const height = (this.height as number) + 5;

    canvasContext.beginPath();
    canvasContext.strokeStyle = '#000';
    canvasContext.strokeRect(
      -width / 2,
      -height / 2,
      width,
      height
    );
  }

  renderResizeHandles(canvasContext: CanvasRenderingContext2D): void {
    this.resizeHandles.setPosition(
      (this.left as number) - 5,
      (this.top as number) - 5,
      (this.width  as number) + 10,
      (this.height  as number) + 5,
      this.bearing
    );
    this.resizeHandles.render(canvasContext);
  }

  onClick(canvasMouseEvent: CanvasMouseEvent): void {
    console.log(canvasMouseEvent);
  }

  onMouseMove(canvasMouseEvent: CanvasMouseEvent): void {
    console.log(canvasMouseEvent);
  }

  onMouseOut(canvasMouseEvent: CanvasMouseEvent): void {
    console.log(canvasMouseEvent);
  }

  onMouseUp(canvasMouseEvent: CanvasMouseEvent): void {
    console.log(canvasMouseEvent);
  }

  onMouseDown(canvasMouseEvent: CanvasMouseEvent): void {
   console.log(canvasMouseEvent);
  }

  onDrag(canvasMouseEvent: CanvasMouseEvent): void {
    console.log(canvasMouseEvent);
  }

  onDrop(canvasMouseEvent: CanvasMouseEvent): void {
    console.log(canvasMouseEvent);
  }

  // tslint:disable-next-line:ban-types
  addEventListener(key: string, callback: Function): void {
    this.eventListeners.set(key, callback);
  }

  abstract clone(): DesignElement;
  abstract render(canvasRef: CanvasRenderingContext2D): DesignElement;
  abstract resize(mouseHandleUsed: string, mouseX: number, mouseY: number): void;
}
