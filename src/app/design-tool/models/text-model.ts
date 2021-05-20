import { DesignElement } from './design-element';
import { Dimensions } from './../types/dimensions';
import { TextFormat } from './../types/text-format';
import { Text } from './../types/text';
import { TextAlign } from '../types/text-align.enum';

export class TextModel extends DesignElement implements Text{
  value = 'New Text Element';

  format = {
    font: 'Arial',
    size: 12,
    color: '#000',
    opacity: 100,
    bgColor: '#FFF',
    isBold: false,
    isItalic: false,
    alignment: TextAlign.LEFT
  } as TextFormat;

  constructor() {
    super();
  }

  renderToCanvas(canvasContext: CanvasRenderingContext2D): void{
    canvasContext.textBaseline = 'bottom';
    canvasContext.fillStyle = this.format.color;
    canvasContext.font = `${this.format.size}px ${this.format.font}`;
    const metrics = canvasContext.measureText(this.value);

    this.dimensions.width = metrics.width;
    this.dimensions.height = metrics.actualBoundingBoxAscent;

    canvasContext.fillText(this.value, this.coordinates.left, this.coordinates.top + this.dimensions.height);

    if (this.isHovered || this.isSelected) {
      this.displayOutline(canvasContext);
    }

    if(this.isSelected) {
      this.displayResizeHandles(canvasContext);
    }
  }

  clone(): TextModel {
    const theClone = new TextModel();

    theClone.value = this.value;
    theClone.format = {...this.format};
    theClone.dimensions = {...this.dimensions};
    theClone.isHovered = this.isHovered;
    theClone.isSelected = this.isSelected;
    theClone.coordinates = {...this.coordinates};
    theClone.zIndex = this.zIndex;

    return theClone;
  }
}
