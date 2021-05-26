import { Dimensions } from './../../types/dimensions';
import { Coordinates } from './../../types/coordinates';

const DEFAULT_TOP = 100;
const DEFAULT_LEFT = 100;

export abstract class CanvasElement {
  // tslint:disable-next-line:variable-name
  private _coordinates = {} as Coordinates;
  // tslint:disable-next-line:variable-name
  private _dimensions = {} as Dimensions;

  constructor(coordinates?: Coordinates, dimensions?: Dimensions ) {
    this._coordinates = {top: coordinates?.top || DEFAULT_TOP, left: coordinates?.left || DEFAULT_LEFT};
    this._dimensions = {width: dimensions?.width, height: dimensions?.height};
  }

  get height(): number | undefined {
    return this._dimensions.height || 0;
  }

  set height(newHeight: number | undefined) {
    this._dimensions.height = newHeight;
  }

  get width(): number | undefined {
    return this._dimensions.width || 0;
  }

  set width(newWidth: number | undefined) {
    this._dimensions.width = newWidth;
  }

  get top(): number | undefined{
    return this._coordinates.top;
  }

  set top(newTop: number | undefined) {
    this._coordinates.top = newTop;
  }

  get left(): number | undefined{
    return this._coordinates.left;
  }

  set left(newLeft: number | undefined) {
    this._coordinates.left = newLeft;
  }

  get hasCoordinates(): boolean {
    return this.left !== undefined && this.top !== undefined;
  }

  get hasDimensions(): boolean {
    return this.width !== undefined && this.height !== undefined;
  }

  get dimensions(): Dimensions {
    return {...this._dimensions};
  }

  get coordinates(): Coordinates {
    return {...this._coordinates};
  }

  checkIsHovered(mouseX: number, mouseY: number): boolean {
    if (!this.hasCoordinates) {
      return false;
    }

    return mouseX >= (this.left as number) - 5 &&
          mouseX <= (this.left as number) + (this.width as number) + 10 &&
          mouseY >= (this.top as number) - 5 &&
          mouseY <= (this.top as number) + (this.height as number) + 10;
  }
}
