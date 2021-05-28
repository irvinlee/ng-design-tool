import { Observable, Subscription } from 'rxjs';
import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';

const DEFAULT_TOP = 100;
const DEFAULT_LEFT = 200;

export abstract class CanvasElement {
  // tslint:disable-next-line:variable-name
  private _coordinates = {} as Coordinates;
  // tslint:disable-next-line:variable-name
  private _dimensions = {} as Dimensions;

  private hasTriggeredMouseDownEvent = false;
  private hasTriggeredDragEvent = false;
  private hasTriggeredClickEvent = false;
  private mouseSubscription?: Subscription;
  private lastMouseDownTimestamp: number | undefined;

  protected parentCanvasElement: HTMLCanvasElement | undefined;

  isHovered = false;

  constructor(coordinates?: Coordinates, dimensions?: Dimensions, isHovered = false) {
    this._coordinates = {top: coordinates?.top || DEFAULT_TOP, left: coordinates?.left || DEFAULT_LEFT};
    this._dimensions = {width: dimensions?.width, height: dimensions?.height};
    this.isHovered = isHovered;
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
          mouseY >= (this.top as number) - 5 &&
          mouseY <= (this.top as number) + (this.height as number) + 10;
  }

  subscribeToMouseEvents(obs: Observable<{event: MouseEvent, type: string}>): void {
    // clear previous subscriptions if any...
    this.mouseSubscription = obs.subscribe((data) => {
      if (data) {
        const {event, type} = data;
        const {x, y} = this.getRelativeCursorCoordinates(event);

        if (this.checkIsHovered(x, y)) {
          switch (type) {
            case 'mousemove':
              this.isHovered = true;

              if (this.hasTriggeredMouseDownEvent) {
                this.hasTriggeredDragEvent = true;
                this.onDrag(x, y);
              } else {
                this.onMouseMove();
              }
              break;
            case 'mouseup':
              // if the user held the mouse for less than 150ms, we'll consider it a click..
              if (Date.now() - (this.lastMouseDownTimestamp as number) < 150) {
                this.onClick();
                this.hasTriggeredMouseDownEvent = false;
              } else {
                this.hasTriggeredMouseDownEvent = false;
                if (this.hasTriggeredDragEvent) {
                  this.onDrop(x, y);
                  // end drag...
                  this.hasTriggeredDragEvent = false;
                  this.hasTriggeredClickEvent = false;
                } else {
                  this.onMouseUp();
                }
              }
              this.lastMouseDownTimestamp = undefined;
              break;
            case 'mousedown':
              this.hasTriggeredMouseDownEvent = true;
              this.lastMouseDownTimestamp = Date.now();
              break;
          }

        } else if (this.isHovered){
          this.isHovered = false;
          this.onMouseOut();
        }
      }
    });
  }

  unsubscribeMouseEvents(): void {
    this.mouseSubscription?.unsubscribe();
    this.isHovered = false;
    this.hasTriggeredMouseDownEvent = false;
    this.hasTriggeredDragEvent = false;
    this.hasTriggeredClickEvent = false;
  }

  private getRelativeCursorCoordinates(event: MouseEvent): {x: number, y: number} {
    const target = event.target as HTMLCanvasElement;
    return {
      x: event.clientX - target.offsetLeft,
      y: event.clientY - target.offsetTop,
    };
  }

  abstract onClick(): void;
  abstract onMouseMove(): void;
  abstract onMouseOut(): void;
  abstract onMouseUp(): void;
  abstract onMouseDown(): void;
  abstract onDrag(cursorX: number, cursorY: number): void;
  abstract onDrop(cursorX: number, cursorY: number): void;
}
