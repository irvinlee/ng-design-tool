import { CanvasMouseEvent } from './../../types/canvas-mouse-event';
import { BehaviorSubject } from 'rxjs';
import { CanvasElement } from './canvas-element';
import { getRelativeCursorCoordinates } from '../utils';

export class MouseEventHandler {
  private canvasElements: Map<string, CanvasElement> = new Map();
  private mouseEventBehavior: BehaviorSubject<CanvasMouseEvent> = new BehaviorSubject({} as CanvasMouseEvent);
  private previouslyHoveredElementKey = '';
  mouseEventObservable = this.mouseEventBehavior.asObservable();

  constructor(private canvasRef: HTMLCanvasElement) {
    canvasRef.addEventListener('mousedown', this.onMouseDown.bind(this));
    this._bindCanvasMouseEvents();
  }

  private _bindCanvasMouseEvents(): void {
    this.canvasRef?.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvasRef?.addEventListener('click', this.onClick.bind(this));
    this.canvasRef?.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvasRef?.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  unbindCanvasMouseEvents(): void {
    this.canvasRef?.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvasRef?.removeEventListener('click', this.onClick.bind(this));
    this.canvasRef?.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvasRef?.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  getAffectedElementKey(mouseX: number, mouseY: number): string {
    let ret = '';
    let maxZIndex = -1;

    for (const [key, element] of this.canvasElements.entries()) {
      if (element.checkIsHovered(mouseX, mouseY) && element.zIndex > maxZIndex) {
        ret = key;
        maxZIndex = element.zIndex;
      }
    }

    return ret;
  }

  emitMouseEvent(type: string, eventObj: MouseEvent, elementKey?: string): void {
    const {x, y} = getRelativeCursorCoordinates(eventObj);
    const affectedElementKey = elementKey || this.getAffectedElementKey(x, y);

    this.mouseEventBehavior.next({
      target: this.canvasElements.get(affectedElementKey),
      targetKey: affectedElementKey,
      mouseEvent: eventObj,
      type
    });
  }

  onMouseMove(event: MouseEvent): void {
    const {x, y} = getRelativeCursorCoordinates(event);
    const affectedElementKey = this.getAffectedElementKey(x, y);

    if (affectedElementKey) {
      this.previouslyHoveredElementKey = affectedElementKey;
      this.emitMouseEvent('mousemove', event);
    } else if (this.previouslyHoveredElementKey) {
      this.emitMouseEvent('mouseout', event, this.previouslyHoveredElementKey);
      this.previouslyHoveredElementKey = '';
    }
  }

  onClick(event: MouseEvent): void {
    this.emitMouseEvent('click', event);
  }

  onMouseDown(event: MouseEvent): void {
    this.emitMouseEvent('mousedown', event);
  }

  onMouseUp(event: MouseEvent): void {
    this.emitMouseEvent('mouseup', event);
  }

  setElements(canvasElements: Map<string, CanvasElement>): void {
    this.canvasElements = new Map(canvasElements);
  }
}
