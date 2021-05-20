import { Image } from './../types/image';
import { DesignElement } from './design-element';

export class ImageModel extends DesignElement implements Image {
  private imageObj: HTMLImageElement | undefined;

  constructor(public src: string) {
    super();
    this.imageObj = new Image();

    this.imageObj.addEventListener('load', () => {
      this.dimensions.width = this.imageObj?.naturalWidth;
      this.dimensions.height = this.imageObj?.naturalHeight;
    });

    this.imageObj.src = this.src;
  }

  renderToCanvas(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.drawImage(this.imageObj as HTMLImageElement, this.coordinates.left, this.coordinates.top, this.width, this.height);

    if (this.isHovered || this.isSelected) {
      this.displayOutline(canvasContext);
    }

    if (this.isSelected) {
      this.displayResizeHandles(canvasContext);
    }
  }

  clone(): ImageModel {
    const theClone = new ImageModel(this.src);

    theClone.dimensions = {...this.dimensions};
    theClone.isHovered = this.isHovered;
    theClone.isSelected = this.isSelected;
    theClone.coordinates = {...this.coordinates};
    theClone.zIndex = this.zIndex;

    return theClone;
  }
}
