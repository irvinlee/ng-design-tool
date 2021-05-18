import { TextModel } from './../../models/text-model';
import { Shape } from './../../types/shape';
import { Image } from './../../types/image';
import { StockImage } from './../../types/stock-image';
import { BehaviorSubject, Observable } from 'rxjs';

export class Renderer {
  private ctx: CanvasRenderingContext2D | undefined;
  private elements: Map<string, StockImage | Image | Text | Shape> = new Map();
  private mouseHoverSubject: BehaviorSubject<Array<string>> = new BehaviorSubject([] as Array<string>);
  mouseHoverObservable = this.mouseHoverSubject.asObservable();

  // tslint:disable-next-line:variable-name
  constructor(private _elementRef: HTMLCanvasElement) {
    this.ctx = this._elementRef.getContext('2d') as CanvasRenderingContext2D;
    this._bindCanvasMouseEvents();
  }

  clearCanvas(): void{
    this.ctx?.clearRect(0, 0, this._elementRef.width, this._elementRef.height);
  }

  setElements(elements: Map<string, StockImage | Image | Text | Shape>): void{
    this.elements = new Map(elements);
    this._renderElements();
  }

  destroy(): void {
    this._unbindCanvasMouseEvents();
  }

  private _renderElements(): void {
    this.clearCanvas();
    for (const [key, value] of this.elements) {
      if (value instanceof TextModel) {
        value.renderToCanvas(this.ctx as CanvasRenderingContext2D);
      }
    }
  }

  private _getHoveredElements(mouseX: number, mouseY: number): Array<string> {
    const ret: Array<string> = [];

    for (const [key, value] of this.elements) {
      if (value instanceof TextModel && value.checkIsHovered(mouseX, mouseY)) {
        ret.push(key);
      }
    }

    return ret;
  }

  private _onCanvasMouseMove(event: MouseEvent): void {
    const mouseCoords = this._getRelativeCursorCoordinates(event);
    this.mouseHoverSubject.next(this._getHoveredElements(mouseCoords.x, mouseCoords.y));
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
  }

  private _unbindCanvasMouseEvents(): void {
    this._elementRef?.removeEventListener('mousemove', this._onCanvasMouseMove.bind(this));
  }
}
