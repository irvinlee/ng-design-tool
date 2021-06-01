import { MouseHandle } from './../common/classes/mouse-handle';
import { CanvasElement } from '../common/classes/canvas-element';

export interface CanvasMouseEvent {
  target?: CanvasElement;
  targetKey?: string;
  mouseEvent: MouseEvent;
  type: string;
  transformHandle?: MouseHandle;
}
