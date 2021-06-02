import { MouseHandle } from './mouse-handle';
import { CanvasMouseEvent } from './../../types/canvas-mouse-event';
import { ResizeHandles } from './resize-handles';
import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';
import { CanvasElement } from './canvas-element';
import { getRelativeCursorCoordinates } from '../utils';

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
    zoomLevel = 1,
    // tslint:disable-next-line:ban-types
    eventListeners?: Map<string, Function>
  ) {
    super(coordinates, dimensions, isHovered, zIndex, zoomLevel);
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

  getHoveredResizeHandle(mouseX: number, mouseY: number): MouseHandle|undefined {
    for (const handle of this.resizeHandles.elements) {
      if (handle.checkIsHovered(mouseX, mouseY)) {
        return handle as MouseHandle;
      }
    }
    return;
  }

  onClick(canvasMouseEvent: CanvasMouseEvent): void {
    if (this.eventListeners.has('click')) {
      // tslint:disable-next-line:ban-types
      const clickCB = this.eventListeners.get('click') as Function;
      clickCB(this);
    }
  }

  onMouseMove(canvasMouseEvent: CanvasMouseEvent): void {
    if (this.eventListeners.has('click')) {
      // tslint:disable-next-line:ban-types
      const mouseMoveCB = this.eventListeners.get('mousemove') as Function;
      mouseMoveCB(this);
    }
  }

  onMouseOut(canvasMouseEvent: CanvasMouseEvent): void {
    // tslint:disable-next-line:ban-types
    const mouseOutCB = this.eventListeners.get('mouseout') as Function;
    mouseOutCB(this);
  }

  onDrag(canvasMouseEvent: CanvasMouseEvent): void {
    if (canvasMouseEvent.type === 'resize') {
      this.onResize(canvasMouseEvent);
    } else if (canvasMouseEvent.type === 'rotate') {
      this.onRotate(canvasMouseEvent);
    }else {
      const {mouseEvent} = canvasMouseEvent;
      const {x, y} = getRelativeCursorCoordinates(mouseEvent);

      if (this.eventListeners.has('drag')) {
        // tslint:disable-next-line:ban-types
        const dragCB = this.eventListeners.get('drag') as Function;
        dragCB(this, {cursorX: x, cursorY: y});
      }
    }
  }

  onDrop(canvasMouseEvent: CanvasMouseEvent): void {
    console.log('drop!');
    // tslint:disable-next-line:ban-types
    const dropCB = this.eventListeners.get('drop') as Function;
    dropCB(this, canvasMouseEvent);
  }

  onResize(canvasMouseEvent: CanvasMouseEvent): void {
    if (this.eventListeners.has('resize')) {
      const {x, y} = getRelativeCursorCoordinates(canvasMouseEvent.mouseEvent);
      // tslint:disable-next-line:ban-types
      const resizeCB = this.eventListeners.get('resize') as Function;
      resizeCB(this, canvasMouseEvent, {cursorX: x, cursorY: y});
    }
  }

  onRotate(canvasMouseEvent: CanvasMouseEvent): void {
    if (this.eventListeners.has('rotate')) {
      const {x, y} = getRelativeCursorCoordinates(canvasMouseEvent.mouseEvent);
      // tslint:disable-next-line:ban-types
      const rotateCB = this.eventListeners.get('rotate') as Function;
      rotateCB(this, {cursorX: x, cursorY: y});
    }
  }

  // tslint:disable-next-line:ban-types
  addEventListener(key: string, callback: Function): void {
    this.eventListeners.set(key, callback);
  }

  abstract clone(): DesignElement;
  abstract render(canvasRef: CanvasRenderingContext2D): DesignElement;
  abstract resize(mouseHandleUsed: string, mouseX: number, mouseY: number): void;
  abstract rotate(baseElement: DesignElement, mouseX: number, mouseY: number): void;
}
