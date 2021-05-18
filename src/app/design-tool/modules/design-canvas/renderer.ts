import { TextModel } from './../../models/text-model';
import { Shape } from './../../types/shape';
import { Image } from './../../types/image';
import { StockImage } from './../../types/stock-image';
export class Renderer {
  // tslint:disable-next-line:variable-name
  private _ctx: CanvasRenderingContext2D | undefined;

  // tslint:disable-next-line:variable-name
  constructor(private _elementRef: HTMLCanvasElement) {
    this._ctx = this._elementRef.getContext('2d') as CanvasRenderingContext2D;
  }

  clearCanvas(): void{
    this._ctx?.clearRect(0, 0, this._elementRef.width, this._elementRef.height);
  }

  renderElements(elements: any): void{
    this.clearCanvas();
    for (const [key, value] of elements) {
      if (value instanceof TextModel) {
        value.renderToCanvas(this._ctx as CanvasRenderingContext2D);
      }
    }
  }
}
