import { CanvasElement } from '../common/classes/canvas-element';

export interface CanvasMouseEvent {
  target: CanvasElement;
  mouseEvent: MouseEvent;
  type: string;
}
