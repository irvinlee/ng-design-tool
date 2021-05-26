import { DesignElement } from './design-element';

export class ImageElement extends DesignElement{
  src = 'https://www.digitalroominc.com/uploads/1/0/3/1/103161570/editor/dri-logo_2.png?1516669567';

  constructor(elementToClone = {} as ImageElement) {
    super(
      elementToClone.coordinates,
      elementToClone.dimensions,
      elementToClone.isHovered,
      elementToClone.isSelected,
      elementToClone.zIndex
    );
    this.src = elementToClone.src;
  }

  clone(): ImageElement {
    return new ImageElement(this);
  }

  render(canvasRef: HTMLCanvasElement): void {

  }
}
