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
  isHovered = false;

  constructor() {

  }

  checkIsHovered(mouseX: number, mouseY: number): boolean {
    return mouseX >= this.metrics.actualBoundingBoxLeft &&
          mouseX <= this.metrics.actualBoundingBoxRight &&
          mouseY >= this.metrics.actualBoundingBoxDescent &&
          mouseY <= this.metrics.actualBoundingBoxAscent;
  }

  renderToCanvas(canvasContext: CanvasRenderingContext2D): void{
    canvasContext.fillStyle = this.format.color;
    canvasContext.font = `${this.format.size}px ${this.format.font}`;
    this.metrics = canvasContext.measureText(this.value);
    // if (this.isHovered) {
    //   canvasContext.fillStyle = 'red';
    // }
    canvasContext.fillText(this.value, this.coordinates.left, this.coordinates.top);

    // if (this.isHovered) {
    //   canvasContext.beginPath();
    //   canvasContext.rect(
    //     this.metrics.actualBoundingBoxLeft,
    //     this.metrics.actualBoundingBoxDescent,
    //     this.metrics.width,
    //     this.metrics.actualBoundingBoxDescent
    //   );
    //   canvasContext.stroke();
    // }
  }
}
