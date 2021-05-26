import { TextFormat } from './../../types/text-format';
import { DesignElement } from './design-element';

export class TextElement extends DesignElement{
  value = 'New Text Element';
  formatting = {} as TextFormat;

  constructor(elementToClone = {} as TextElement) {
    super(
      elementToClone.coordinates,
      elementToClone.dimensions,
      elementToClone.isHovered,
      elementToClone.isSelected,
      elementToClone.zIndex
    );
    this.value = elementToClone.value;
    this.formatting = {...elementToClone.formatting};
  }

  clone(): TextElement {
    return new TextElement(this);
  }

  render(canvasRef: CanvasRenderingContext2D): void {

  }
}
