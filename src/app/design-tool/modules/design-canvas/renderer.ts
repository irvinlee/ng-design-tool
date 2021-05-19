import { ElementDragEvent } from './../../types/element-drag-event';
import { DesignElement } from '../../models/design-element';
import { BehaviorSubject } from 'rxjs';

export class Renderer {
  private ctx: CanvasRenderingContext2D | undefined;
  private elements: Map<string, DesignElement> = new Map();
  private mouseHoverSubject: BehaviorSubject<string> = new BehaviorSubject('');
  private clickSubject: BehaviorSubject<string> = new BehaviorSubject('');
  private elementDragSubject: BehaviorSubject<ElementDragEvent> = new BehaviorSubject({} as ElementDragEvent);
  private elementDropSubject: BehaviorSubject<ElementDragEvent> = new BehaviorSubject({} as ElementDragEvent);
  private draggedElementKey = '';

  mouseHoverObservable = this.mouseHoverSubject.asObservable();
  mouseClickObservable = this.clickSubject.asObservable();
  elementDragObservable = this.elementDragSubject.asObservable();
  elementDropObservable = this.elementDropSubject.asObservable();

  // tslint:disable-next-line:variable-name
  constructor(private _elementRef: HTMLCanvasElement) {
    this.ctx = this._elementRef.getContext('2d') as CanvasRenderingContext2D;
    this._bindCanvasMouseEvents();
  }

  clearCanvas(): void{
    this.ctx?.clearRect(0, 0, this._elementRef.width, this._elementRef.height);
  }

  setElements(elements: Map<string, DesignElement>): void{
    this.elements = new Map(elements);
    this._renderElements();
  }

  destroy(): void {
    this._unbindCanvasMouseEvents();
  }

  private _renderElements(): void {
    this.clearCanvas();
    for (const [key, value] of this.elements) {
      value.renderToCanvas(this.ctx as CanvasRenderingContext2D);
    }
  }

  private _getHoveredElement(mouseX: number, mouseY: number): string {
    let hoveredKey = '';

    for ( const [ key, value ] of this.elements.entries()) {
      if (value.checkIsHovered(mouseX, mouseY)) {
        if (!hoveredKey || (this.elements.get(hoveredKey) as DesignElement)?.zIndex < value.zIndex) {
          hoveredKey = key;
        }
      }
    }

    return hoveredKey;
  }

  private _onCanvasMouseMove(event: MouseEvent): void {
    const {x, y} = this._getRelativeCursorCoordinates(event);

    if (!this.draggedElementKey) { // if the user is not dragging an element
      this.mouseHoverSubject.next(this._getHoveredElement(x, y));
    } else {
      this.elementDragSubject.next({elementKey: this.draggedElementKey, x, y } as ElementDragEvent);
    }
  }

  private _onCanvasClick(event: MouseEvent): void {
    const {x, y} = this._getRelativeCursorCoordinates(event);
    this.clickSubject.next(this._getHoveredElement(x, y));
  }

  private _onCanvasMouseDown(event: MouseEvent): void {
    const {x, y} = this._getRelativeCursorCoordinates(event);
    this.draggedElementKey = this._getHoveredElement(x, y);
  }

  private _onCanvasMouseUp(event: MouseEvent): void {
    const {x, y} = this._getRelativeCursorCoordinates(event);
    this.elementDropSubject.next({elementKey: this.draggedElementKey, x, y} as ElementDragEvent);
    this.draggedElementKey = '';
  }

  private _getRelativeCursorCoordinates(event: MouseEvent): {x: number, y: number} {
    const target = event.target as HTMLCanvasElement;
    return {
      x: event.clientX - target.offsetLeft,
      y: event.clientY - target.offsetTop,
    };
  }

  private _bindCanvasMouseEvents(): void {
    this._elementRef?.addEventListener('mousemove', this._onCanvasMouseMove.bind(this));
    this._elementRef?.addEventListener('click', this._onCanvasClick.bind(this));
    this._elementRef?.addEventListener('mousedown', this._onCanvasMouseDown.bind(this));
    this._elementRef?.addEventListener('mouseup', this._onCanvasMouseUp.bind(this));
  }

  private _unbindCanvasMouseEvents(): void {
    this._elementRef?.removeEventListener('mousemove', this._onCanvasMouseMove.bind(this));
    this._elementRef?.removeEventListener('click', this._onCanvasClick.bind(this));
    this._elementRef?.removeEventListener('mousedown', this._onCanvasMouseDown.bind(this));
    this._elementRef?.removeEventListener('mouseup', this._onCanvasMouseUp.bind(this));
  }
}
