export class Renderer {
  // tslint:disable-next-line:variable-name
  private _ctx: CanvasRenderingContext2D | undefined;

  // tslint:disable-next-line:variable-name
  constructor(private _elementRef: HTMLCanvasElement) {
    this._ctx = this._elementRef.getContext('2d') as CanvasRenderingContext2D;
  }

}
