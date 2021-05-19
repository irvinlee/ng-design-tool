import { DesignElement } from './../../types/design-element';
import { TextModel } from './../../models/text-model';
import { Shape } from './../../types/shape';
import { Image } from './../../types/image';
import { StockImage } from './../../types/stock-image';
import { BehaviorSubject, Observable } from 'rxjs';

export class Renderer {
  private ctx: CanvasRenderingContext2D | undefined;
  private elements: Map<string, DesignElement> = new Map();
  private mouseHoverSubject: BehaviorSubject<string> = new BehaviorSubject('');
  private clickSubject: BehaviorSubject<string> = new BehaviorSubject('');

  mouseHoverObservable = this.mouseHoverSubject.asObservable();
  mouseClickObservable = this.clickSubject.asObservable();

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

  private _getHoveredElements(mouseX: number, mouseY: number): string {
    const mapKeys = Array.from(this.elements.keys()).reverse();

    for (const mapKey of mapKeys) {
      if (this.elements.get(mapKey)?.checkIsHovered(mouseX, mouseY)) {
        return mapKey;
      }
    }

    return '';
  }

  private _onCanvasMouseMove(event: MouseEvent): void {
    const {x, y} = this._getRelativeCursorCoordinates(event);
    this.mouseHoverSubject.next(this._getHoveredElements(x, y));
  }

  private _onCanvasClick(event: MouseEvent): void {
    const {x, y} = this._getRelativeCursorCoordinates(event);
    this.clickSubject.next(this._getHoveredElements(x, y));
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
  }

  private _unbindCanvasMouseEvents(): void {
    this._elementRef?.removeEventListener('mousemove', this._onCanvasMouseMove.bind(this));
    this._elementRef?.removeEventListener('click', this._onCanvasClick.bind(this));
  }
}
