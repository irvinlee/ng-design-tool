import { HoveredElement } from './hovered-element';

export interface ElementDragEvent {
  element: HoveredElement;
  x: number;
  y: number;
}
