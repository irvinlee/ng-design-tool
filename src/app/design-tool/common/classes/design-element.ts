import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';
import { CanvasElement } from './canvas-element';

export abstract class DesignElement extends CanvasElement{
  isSelected = false;
  zIndex = 0;
  // tslint:disable-next-line:ban-types
  eventListeners: Map<string, Function> = new Map();

  constructor(
    coordinates?: Coordinates,
    dimensions?: Dimensions,
    isHovered?: boolean,
    isSelected?: boolean,
    zIndex?: number,
    // tslint:disable-next-line:ban-types
    eventListeners?: Map<string, Function>
  ) {
    super(coordinates, dimensions, isHovered);
    this.isSelected = !!isSelected;
    this.zIndex = zIndex || 0;

    if (eventListeners) {
      this.eventListeners = new Map(eventListeners);
    }
  }

  displayOutline(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.beginPath();
    canvasContext.strokeStyle = '#000';
    canvasContext.strokeRect(
      (this.left as number) - 5,
      (this.top  as number) - 5,
      (this.width  as number) + 10,
      (this.height  as number) + 5
    );
    // console.log(canvasContext);
    // console.log(`${this.left} - ${this.top} - ${this.width} - ${this.height}`);
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

  abstract clone(): DesignElement;
  abstract render(canvasRef: CanvasRenderingContext2D): DesignElement;
}
