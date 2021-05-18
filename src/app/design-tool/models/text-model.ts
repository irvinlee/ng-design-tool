import { Coordinates } from './../types/coordinates';
import { Dimensions } from './../types/dimensions';
import { TextFormat } from './../types/text-format';
import { Text } from './../types/text';
import { TextAlign } from '../types/text-align.enum';

export class TextModel implements Text{
  value = 'New Text Element';
  coordinates = {top: 10, left: 10} as Coordinates;
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
  metrics = {} as TextMetrics;

  constructor() {

  }

  renderToCanvas(canvasContext: CanvasRenderingContext2D): void{
    canvasContext.font = `${this.format.size}px ${this.format.font}`;
    this.metrics = canvasContext.measureText(this.value);
    canvasContext.fillText(this.value, this.coordinates.left, this.coordinates.top);
  }
}
