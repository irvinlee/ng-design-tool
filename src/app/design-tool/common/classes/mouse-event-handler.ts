import { CanvasMouseEvent } from './../../types/canvas-mouse-event';
import { BehaviorSubject } from 'rxjs';
import { CanvasElement } from './canvas-element';

export class MouseEventHandler {
  private canvasElements: Map<string, CanvasElement> = new Map();
  private mouseEventBehavior: BehaviorSubject<CanvasMouseEvent> = new BehaviorSubject({} as CanvasMouseEvent);

  mouseEventObservable = this.mouseEventBehavior.asObservable();

  constructor(private canvasRef: HTMLCanvasElement) {
    canvasRef.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  getAffectedElement(mouseX: number, mouseY: number): CanvasElement {
  }

  onMouseDown(event: MouseEvent): void {

  }

  set elements(canvasElements: Map<string, CanvasElement>) {
    this.canvasElements = new Map(canvasElements);
  }
}
