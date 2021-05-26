import { TextFormat } from './../../types/text-format';
import { DesignElement } from './design-element';

const DEFAULT_TEXT = 'New Text Element';

export class TextElement extends DesignElement{
  value = '';
  format = {} as TextFormat;

  constructor(elementToClone = {value: DEFAULT_TEXT} as TextElement) {
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

  render(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.textBaseline = 'bottom';
    canvasContext.fillStyle = this.format.color;
    canvasContext.font = `${this.format.size}px ${this.format.font}`;
    const metrics = canvasContext.measureText(this.value);

    this.width = metrics.width;
    this.height = metrics.actualBoundingBoxAscent;

    canvasContext.fillText(this.value, this.left as number, (this.top  as number) + this.height);
  }
}
