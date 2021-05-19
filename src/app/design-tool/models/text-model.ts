import { DesignElement } from './../types/design-element';
import { Coordinates } from './../types/coordinates';
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
  dimensions = {} as Dimensions;

  constructor() {
    super();
  }

  renderToCanvas(canvasContext: CanvasRenderingContext2D): void{
    canvasContext.textBaseline = 'bottom';
    canvasContext.fillStyle = this.format.color;
    canvasContext.font = `${this.format.size}px ${this.format.font}`;
    this.metrics = canvasContext.measureText(this.value);

    canvasContext.fillText(this.value, this.coordinates.left, this.coordinates.top);

    if (this.isHovered) {
      canvasContext.beginPath();
      canvasContext.rect(
        this.coordinates.left - 5,
        this.coordinates.top - this.metrics.actualBoundingBoxAscent - 5,
        this.metrics.width + 10,
        this.metrics.actualBoundingBoxAscent + 5
      );
      canvasContext.stroke();
    }
  }
}
