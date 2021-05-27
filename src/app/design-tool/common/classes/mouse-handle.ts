import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';
import { CanvasElement } from './canvas-element';

export class MouseHandle extends CanvasElement{
  // tslint:disable-next-line:ban-types
  eventListeners: Map<string, Function> = new Map();

  constructor(coordinates?: Coordinates) {
    super(coordinates, {width: 8, height: 8} as Dimensions);
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

  onClick(): void {
    if (this.eventListeners.has('click')) {
      // tslint:disable-next-line:ban-types
      const clickCB = this.eventListeners.get('click') as Function;
      clickCB(this);
    }
  }

  onMouseMove(): void {
    if (this.eventListeners.has('mousemove')) {
      // tslint:disable-next-line:ban-types
      const mousemoveCB = this.eventListeners.get('mousemove') as Function;
      mousemoveCB(this);
    }
  }

  onMouseOut(): void {
    if (this.eventListeners.has('mouseout')) {
      // tslint:disable-next-line:ban-types
      const mouseOutCB = this.eventListeners.get('mouseout') as Function;
      mouseOutCB(this);
    }
  }

  onMouseUp(): void {
    console.log('mouse up');
  }

  onMouseDown(): void {
   console.log('mouse down');
  }

  onDrag(cursorX: number, cursorY: number): void {
    if (this.eventListeners.has('drag')) {
      // tslint:disable-next-line:ban-types
      const dragCB = this.eventListeners.get('drag') as Function;
      dragCB(this, {cursorX, cursorY});
    }
  }

  onDrop(cursorX: number, cursorY: number): void {
    if (this.eventListeners.has('drop')) {
      // tslint:disable-next-line:ban-types
      const dropCB = this.eventListeners.get('drop') as Function;
      dropCB(this, {cursorX, cursorY});
    }
  }

  // tslint:disable-next-line:ban-types
  addEventListener(key: string, callback: Function): void {
    this.eventListeners.set(key, callback);
  }
}
