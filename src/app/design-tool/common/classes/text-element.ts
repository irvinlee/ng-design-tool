import { TextAlign } from './../../types/text-align.enum';
import { TextFormat } from './../../types/text-format';
import { DesignElement } from './design-element';

const DEFAULT_TEXT = 'New Text Element';
const DEFAULT_FORMAT = {
  font: 'Arial',
    size: 24,
    color: '#000',
    opacity: 100,
    bgColor: '#FFF',
    isBold: false,
    isItalic: false,
    alignment: TextAlign.LEFT
} as TextFormat;

export class TextElement extends DesignElement{
  value = '';
  format = {} as TextFormat;

  constructor(elementToClone = {value: DEFAULT_TEXT, format: DEFAULT_FORMAT} as TextElement) {
    super(
      elementToClone.coordinates,
      elementToClone.dimensions,
      elementToClone.isHovered,
      elementToClone.isSelected,
      elementToClone.zIndex
    );
    this.value = elementToClone.value;
    this.format = {...elementToClone.format};
  }

  clone(): TextElement {
    return new TextElement(this);
  }

  render(canvasContext: CanvasRenderingContext2D): TextElement {
    canvasContext.textBaseline = 'bottom';
    canvasContext.fillStyle = this.format.color;
    canvasContext.font = `${this.format.size}px ${this.format.font}`;
    const metrics = canvasContext.measureText(this.value);

    this.width = metrics.width;
    this.height = metrics.actualBoundingBoxAscent;

    canvasContext.fillText(this.value, this.left as number, (this.top  as number) + this.height);
    return this;
  }

  onClick(): void {
    console.log('clicked');
  }

  onMouseMove(): void {
    console.log('hovered');
  }

  onMouseOut(): void {
    console.log('mouse out');
  }

  onMouseUp(): void {
    console.log('mouse up');
  }

  onMouseDown(): void {
   console.log('mouse down');
  }

  onDrag(): void {
    console.log('drag start');
  }

  onDrop(): void {
    console.log('drop...');
  }
}
