import { TextModel } from './../../models/text-model';
import { Shape } from './../../types/shape';
import { Image } from './../../types/image';
import { StockImage } from './../../types/stock-image';
export class Renderer {
  // tslint:disable-next-line:variable-name
  private _ctx: CanvasRenderingContext2D | undefined;
  // tslint:disable-next-line:variable-name
  private _elements: Map<string, StockImage | Image | Text | Shape> = new Map();

  // tslint:disable-next-line:variable-name
  constructor(private _elementRef: HTMLCanvasElement) {
    this._ctx = this._elementRef.getContext('2d') as CanvasRenderingContext2D;
    this._bindCanvasMouseEvents();
  }

  clearCanvas(): void{
    this._ctx?.clearRect(0, 0, this._elementRef.width, this._elementRef.height);
  }

  setElements(elements: Map<string, StockImage | Image | Text | Shape>): void{
    this._elements = new Map(elements);
    this._renderElements();
  }

  destroy(): void {
    this._unbindCanvasMouseEvents();
  }

  private _renderElements(): void {
    this.clearCanvas();
    for (const [key, value] of this._elements) {
      if (value instanceof TextModel) {
        value.renderToCanvas(this._ctx as CanvasRenderingContext2D);
      }
    }
  }

  private _onCanvasMouseMove(event: MouseEvent): void {
    // console.log(event);
    const relativeCoords = {
      x: event.clientX - this._elementRef.offsetLeft,
      y: event.clientY - this._elementRef.offsetTop,
    };
    console.log(relativeCoords);
    event.stopPropagation();
  }

  private _bindCanvasMouseEvents(): void {
    this._elementRef?.addEventListener('mousemove', this._onCanvasMouseMove);
  }

  private _unbindCanvasMouseEvents(): void {
    this._elementRef?.removeEventListener('mousemove', this._onCanvasMouseMove);
  }
}
