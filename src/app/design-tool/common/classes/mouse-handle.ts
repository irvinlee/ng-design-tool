import { CanvasMouseEvent } from './../../types/canvas-mouse-event';
import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';
import { CanvasElement } from './canvas-element';
import { getRelativeCursorCoordinates } from '../utils';

export class MouseHandle extends CanvasElement{
  // tslint:disable-next-line:ban-types
  eventListeners: Map<string, Function> = new Map();
  cursor = 'default';

  constructor(coordinates?: Coordinates, cursor?: string) {
    super(coordinates, {width: 12, height: 12} as Dimensions);
    this.cursor = cursor || 'default';
  }

  render(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.beginPath();
    canvasContext.rect(
      (this.left as number) - (this.width  as number) / 2,
      (this.top  as number) - (this.height  as number) / 2,
      (this.width  as number),
      (this.height  as number)
    );
    canvasContext.fillStyle = 'white';
    canvasContext.fill();
    canvasContext.stroke();
  }

  onClick(canvasMouseEvent: CanvasMouseEvent): void {
    if (this.eventListeners.has('click')) {
      // tslint:disable-next-line:ban-types
      const clickCB = this.eventListeners.get('click') as Function;
      clickCB(this);
    }
  }

  onMouseMove(canvasMouseEvent: CanvasMouseEvent): void {
    if (this.parentCanvasElement) {
      (this.parentCanvasElement as HTMLCanvasElement).style.cursor = this.cursor;
    }
  }

  onMouseOut(canvasMouseEvent: CanvasMouseEvent): void {
    if (this.eventListeners.has('mouseout')) {
      // tslint:disable-next-line:ban-types
      const mouseOutCB = this.eventListeners.get('mouseout') as Function;

      if (this.parentCanvasElement) {
        (this.parentCanvasElement as HTMLCanvasElement).style.cursor = 'default';
      }
      mouseOutCB(this);
    }
  }

  onMouseUp(canvasMouseEvent: CanvasMouseEvent): void {
    console.log('mouse up');
  }

  onMouseDown(canvasMouseEvent: CanvasMouseEvent): void {
    if (this.eventListeners.has('mousedown')) {
      const {mouseEvent} = canvasMouseEvent;
      const {x, y} = getRelativeCursorCoordinates(mouseEvent);
      // tslint:disable-next-line:ban-types
      const mouseDownCB = this.eventListeners.get('mousedown') as Function;

      mouseDownCB(x, y);
    }
  }

  onDrag(canvasMouseEvent: CanvasMouseEvent): void {
    const {mouseEvent, type} = canvasMouseEvent;
    const {x, y} = getRelativeCursorCoordinates(mouseEvent);

    if (this.eventListeners.has('drag')) {
      // tslint:disable-next-line:ban-types
      const dragCB = this.eventListeners.get('drag') as Function;
      dragCB(x, y);
    }
  }

  onDrop(canvasMouseEvent: CanvasMouseEvent): void {
    const {mouseEvent, type} = canvasMouseEvent;
    const {x, y} = getRelativeCursorCoordinates(mouseEvent);

    if (this.eventListeners.has('drop')) {
      // tslint:disable-next-line:ban-types
      const dropCB = this.eventListeners.get('drop') as Function;
      dropCB(x, y);
    }
  }
  // tslint:disable-next-line:ban-types
  addEventListener(key: string, callback: Function): void {
    this.eventListeners.set(key, callback);
  }
}
