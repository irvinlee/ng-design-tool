import { CanvasMouseEvent } from './../../types/canvas-mouse-event';
import { ElementMouseHandles } from './../../types/element-mouse-handles.enum';
import { Observable } from 'rxjs';
import { ResizeHandles } from './resize-handles';
import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';
import { CanvasElement } from './canvas-element';
import { degToRad, getRelativeCursorCoordinates } from '../utils';

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

  bindMouseEvents(): void {
    this.resizeHandles.topLeftHandle.addEventListener('drag', (cursorX: number, cursorY: number) => {
      if (this.eventListeners.has('resize')) {
        // tslint:disable-next-line:ban-types
        const cb = this.eventListeners.get('resize') as Function;
        cb(this, ElementMouseHandles.TOP_LEFT, cursorX, cursorY);
      }
    });

    this.resizeHandles.topRightHandle.addEventListener('drag', (cursorX: number, cursorY: number) => {
      if (this.eventListeners.has('resize')) {
        // tslint:disable-next-line:ban-types
        const cb = this.eventListeners.get('resize') as Function;
        cb(this, ElementMouseHandles.TOP_RIGHT, cursorX, cursorY);
      }
    });

    this.resizeHandles.bottomLeftHandle.addEventListener('drag', (cursorX: number, cursorY: number) => {
      if (this.eventListeners.has('resize')) {
        // tslint:disable-next-line:ban-types
        const cb = this.eventListeners.get('resize') as Function;
        cb(this, ElementMouseHandles.BOTTOM_LEFT, cursorX, cursorY);
      }
    });

    this.resizeHandles.bottomRightHandle.addEventListener('drag', (cursorX: number, cursorY: number) => {
      if (this.eventListeners.has('resize')) {
        // tslint:disable-next-line:ban-types
        const cb = this.eventListeners.get('resize') as Function;
        cb(this, ElementMouseHandles.BOTTOM_RIGHT, cursorX, cursorY);
      }
    });

    this.resizeHandles.rotateHandle.addEventListener('mousedown', (cursorX: number, cursorY: number) => {
      if (this.eventListeners.has('startRotate')) {
        // tslint:disable-next-line:ban-types
        const cb = this.eventListeners.get('startRotate') as Function;
        cb();
      }
    });
  }

  get midpointX(): number {
    return (this.left as number) + ((this.width as number) / 2);
  }

  get midpointY(): number {
    return (this.top as number) + ((this.height as number) / 2);
  }

  displayOutline(canvasContext: CanvasRenderingContext2D): void {
    const left = (this.left as number) - 5;
    const top = (this.top as number) - 5;
    const width = (this.width as number) + 10;
    const height = (this.height as number) + 5;

    // canvasContext.save();

    // const xCenter = left + (width / 2);
    // const yCenter = top + (height / 2);
    // const angle = degToRad(this.bearing);

    // canvasContext.translate(xCenter, yCenter);
    // canvasContext.rotate(angle);

    canvasContext.beginPath();
    canvasContext.strokeStyle = '#000';
    canvasContext.strokeRect(
      -width / 2,
      -height / 2,
      width,
      height
    );

    // canvasContext.rotate(-angle);
    // canvasContext.translate(-xCenter, -yCenter);
    // canvasContext.restore();
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

  getHoveredResizeHandle(canvasMouseEvent: CanvasMouseEvent): CanvasElement|undefined {
    const { mouseEvent } = canvasMouseEvent;
    const {x, y} = getRelativeCursorCoordinates(mouseEvent);

    for (const element of this.resizeHandles.elements) {
      if (element.checkIsHovered(x, y)) {
        return element;
      }
    }
    return;
  }

  onClick(canvasMouseEvent: CanvasMouseEvent): void {
    const targetResizeHandle = this.getHoveredResizeHandle(canvasMouseEvent);

    if (targetResizeHandle) {
      targetResizeHandle.handleMouseEvent(canvasMouseEvent);
    } else if (this.eventListeners.has('click')) {
      // tslint:disable-next-line:ban-types
      const clickCB = this.eventListeners.get('click') as Function;
      clickCB(this);
    }
  }

  onMouseMove(canvasMouseEvent: CanvasMouseEvent): void {
    const targetResizeHandle = this.getHoveredResizeHandle(canvasMouseEvent);

    if (targetResizeHandle) {
      targetResizeHandle.handleMouseEvent(canvasMouseEvent);
    } else if (this.eventListeners.has('mousemove')) {
      // tslint:disable-next-line:ban-types
      const mousemoveCB = this.eventListeners.get('mousemove') as Function;
      mousemoveCB(this);
    }
  }

  onMouseOut(canvasMouseEvent: CanvasMouseEvent): void {
    const targetResizeHandle = this.getHoveredResizeHandle(canvasMouseEvent);

    if (targetResizeHandle) {
      targetResizeHandle.handleMouseEvent(canvasMouseEvent);
    } else if (this.eventListeners.has('mouseout')) {
      // tslint:disable-next-line:ban-types
      const mouseOutCB = this.eventListeners.get('mouseout') as Function;
      mouseOutCB(this);
    }
  }

  onMouseUp(canvasMouseEvent: CanvasMouseEvent): void {
    const targetResizeHandle = this.getHoveredResizeHandle(canvasMouseEvent);

    if (targetResizeHandle) {
      targetResizeHandle.handleMouseEvent(canvasMouseEvent);
    } else if (this.eventListeners.has('mouseup')) {
      // tslint:disable-next-line:ban-types
      const mouseUpCB = this.eventListeners.get('mouseup') as Function;
      mouseUpCB(this);
    }
  }

  onMouseDown(canvasMouseEvent: CanvasMouseEvent): void {
   const targetResizeHandle = this.getHoveredResizeHandle(canvasMouseEvent);

   if (targetResizeHandle) {
     targetResizeHandle.handleMouseEvent(canvasMouseEvent);
   } else if (this.eventListeners.has('mousedown')) {
      // tslint:disable-next-line:ban-types
      const mouseDownCB = this.eventListeners.get('mousedown') as Function;
      mouseDownCB(this);
    }
  }

  onDrag(canvasMouseEvent: CanvasMouseEvent): void {
    const targetResizeHandle = this.getHoveredResizeHandle(canvasMouseEvent);

    if (targetResizeHandle) {
      targetResizeHandle.handleMouseEvent(canvasMouseEvent);
    } else {
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
    const targetResizeHandle = this.getHoveredResizeHandle(canvasMouseEvent);

    if (targetResizeHandle) {
      targetResizeHandle.handleMouseEvent(canvasMouseEvent);
    } else {
      const {mouseEvent} = canvasMouseEvent;
      const {x, y} = getRelativeCursorCoordinates(mouseEvent);

      if (this.eventListeners.has('drop')) {
        // tslint:disable-next-line:ban-types
        const dropCB = this.eventListeners.get('drop') as Function;
        dropCB(this, {cursorX: x, cursorY: y});
      }
    }
  }

  // tslint:disable-next-line:ban-types
  addEventListener(key: string, callback: Function): void {
    this.eventListeners.set(key, callback);
  }

  abstract clone(): DesignElement;
  abstract render(canvasRef: CanvasRenderingContext2D): DesignElement;
  abstract resize(mouseHandleUsed: string, mouseX: number, mouseY: number): void;
}
