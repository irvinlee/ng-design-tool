import { MouseHandleTypes } from './../../types/mouse-handle-types.enum';
import { MouseHandle } from './mouse-handle';
import { CanvasMouseEvent } from './../../types/canvas-mouse-event';
import { BehaviorSubject } from 'rxjs';
import { CanvasElement } from './canvas-element';
import { getRelativeCursorCoordinates } from '../utils';
import { DesignElement } from './design-element';
import throttle from 'lodash.throttle';

export class MouseEventHandler {
  private designElement: Map<string, DesignElement> = new Map();
  private mouseEventBehavior: BehaviorSubject<CanvasMouseEvent> = new BehaviorSubject({} as CanvasMouseEvent);
  private previouslyHoveredElementKey = '';
  private draggedElementKey = '';
  private lastMouseDownCoordinates?: {x: number, y: number};
  private activeTransformHandle?: MouseHandle;

  mouseEventObservable = this.mouseEventBehavior.asObservable();

  constructor(private canvasRef: HTMLCanvasElement) {
    canvasRef.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.bindCanvasMouseEvents();
  }

  private bindCanvasMouseEvents = (): void => {
    this.canvasRef?.addEventListener('mousemove', this.throttledMouseMove);
    this.canvasRef?.addEventListener('mousedown', this.onMouseDown);
    this.canvasRef?.addEventListener('mouseup', this.onMouseUp);
  }

  unbindCanvasMouseEvents = (): void => {
    this.canvasRef?.removeEventListener('mousemove', this.throttledMouseMove);
    this.canvasRef?.removeEventListener('mousedown', this.onMouseDown);
    this.canvasRef?.removeEventListener('mouseup', this.onMouseUp);
  }

  getAffectedElementKey = (mouseX: number, mouseY: number): string => {
    let ret = '';
    let maxZIndex = -1;

    for (const [key, element] of this.designElement.entries()) {
      if ((element.checkIsHovered(mouseX, mouseY) || element.getHoveredResizeHandle(mouseX, mouseY)) && element.zIndex > maxZIndex) {
        ret = key;
        maxZIndex = element.zIndex;
      }
    }
    return ret;
  }

  emitMouseEvent = (type: string, eventObj: MouseEvent, elementKey?: string): void => {
    const {x, y} = getRelativeCursorCoordinates(eventObj);
    const affectedElementKey = elementKey || this.getAffectedElementKey(x, y);

    // TODO: DRY this up...
    if (type === 'mousedown' && affectedElementKey) {
      this.activeTransformHandle = this.designElement.get(affectedElementKey)?.getHoveredResizeHandle(x, y);
      this.draggedElementKey = affectedElementKey;
    } else if (type === 'mouseup') {
      if ((this.draggedElementKey || this.activeTransformHandle) && this.checkIfDragging(x, y)) {
        this.mouseEventBehavior.next({
          target: this.designElement.get(this.draggedElementKey),
          targetKey: this.draggedElementKey,
          mouseEvent: eventObj,
          type: 'drop'
        });
      } else {
        this.mouseEventBehavior.next({
          target: this.designElement.get(this.draggedElementKey),
          targetKey: this.draggedElementKey,
          mouseEvent: eventObj,
          type: 'click'
        });
      }

      this.activeTransformHandle = undefined;
      this.lastMouseDownCoordinates = undefined;
      this.draggedElementKey = '';
    }

    if (this.draggedElementKey) {
      if (this.activeTransformHandle && type === 'mousemove') {
        if (this.activeTransformHandle.type === MouseHandleTypes.RESIZE) {
          this.mouseEventBehavior.next({
            target: this.designElement.get(this.draggedElementKey),
            targetKey: this.draggedElementKey,
            mouseEvent: eventObj,
            type: 'resize',
            transformHandle: this.activeTransformHandle
          });
        } else {
          this.mouseEventBehavior.next({
            target: this.designElement.get(this.draggedElementKey),
            targetKey: this.draggedElementKey,
            mouseEvent: eventObj,
            type: 'rotate',
            transformHandle: this.activeTransformHandle
          });
        }
      } else {
        if (type === 'mousemove' ) {
          if (this.checkIfDragging(x, y)) {
            this.mouseEventBehavior.next({
              target: this.designElement.get(this.draggedElementKey),
              targetKey: this.draggedElementKey,
              mouseEvent: eventObj,
              type: 'drag'
            });
          }
        }
      }
    }
    // mousedown will be handled as a drag or phase 1 of "click" so it will no longer be handled by the elements
    // mouseup will be handled as either drop or phase 2 of "click"
    else if (['mouseup', 'mousedown'].indexOf(type) < 0){
      this.mouseEventBehavior.next({
      target: this.designElement.get(affectedElementKey),
      targetKey: affectedElementKey,
      mouseEvent: eventObj,
      type
    });
    }
  }

  checkIfDragging = (x: number, y: number)  => {
    return this.draggedElementKey && this.lastMouseDownCoordinates &&
          (Math.abs(x - (this.lastMouseDownCoordinates?.x as number)) > 5 ||
          (Math.abs(y - (this.lastMouseDownCoordinates?.y as number)) > 5));
  }

  onMouseMove = (event: MouseEvent): void => {
    const {x, y} = getRelativeCursorCoordinates(event);
    const affectedElementKey = this.getAffectedElementKey(x, y);

    if (affectedElementKey || this.checkIfDragging(x, y)) {
      this.previouslyHoveredElementKey = affectedElementKey;
      this.emitMouseEvent('mousemove', event);
    } else if (this.previouslyHoveredElementKey) {
      this.emitMouseEvent('mouseout', event, this.previouslyHoveredElementKey);
      this.previouslyHoveredElementKey = '';
    }
  }

  // tslint:disable-next-line:member-ordering
  throttledMouseMove = (
    // tslint:disable-next-line:ban-types
    throttle(this.onMouseMove, 50) as Function
  ).bind(this);

  onMouseDown = (event: MouseEvent): void => {
    this.lastMouseDownCoordinates = getRelativeCursorCoordinates(event);
    this.emitMouseEvent('mousedown', event);
  }

  onMouseUp = (event: MouseEvent): void => {
    this.emitMouseEvent('mouseup', event);
  }

  setElements(designElements: Map<string, DesignElement>): void {
    this.designElement = new Map(designElements);
  }
}
