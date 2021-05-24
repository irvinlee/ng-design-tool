import { DesignElement } from './design-element';

export class ImageElement extends DesignElement{
  src = '';

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
}
