import { DesignElement } from './design-element';

const defaultImage = 'https://www.digitalroominc.com/uploads/1/0/3/1/103161570/editor/dri-logo_2.png?1516669567';

export class ImageElement extends DesignElement{
  src = '';
  imageObj?: HTMLImageElement;
  isImageLoaded = false;
  isLoadingImage = false;

  constructor(elementToClone = {} as ImageElement) {
    super(
      elementToClone.coordinates,
      elementToClone.dimensions,
      elementToClone.isHovered,
      elementToClone.isSelected,
      elementToClone.zIndex,
      elementToClone.eventListeners
    );

    this.src = elementToClone.src || defaultImage;
    this.imageObj = elementToClone.imageObj;
  }

  clone(): ImageElement {
    return new ImageElement(this);
  }

  loadImage(): void {
    this.isLoadingImage = true;
    this.imageObj = new Image();
    this.imageObj.addEventListener('load', () => {
      this.width = this.imageObj?.naturalWidth;
      this.height = this.imageObj?.naturalHeight;
      this.isImageLoaded = true;
    });
    this.imageObj.src = this.src;
  }

  render(canvasContext: CanvasRenderingContext2D): ImageElement {
    if (!this.src) {
      throw new Error('Invalid Image SRC');
    }

    if (!this.isImageLoaded) {
      if (!this.isLoadingImage) {
        this.loadImage();
      }
      // image not yet ready.. try again a bit later.
      setTimeout(() => this.render(canvasContext), 200);
      return this;
    }

    canvasContext.drawImage(
      this.imageObj as HTMLImageElement,
      this.left as number,
      this.top as number,
      this.width as number,
      this.height as number
    );

    if (this.isHovered || this.isSelected) {
      this.displayOutline(canvasContext);
    }

    return this;
  }
}
