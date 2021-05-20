import { Dimensions } from './../types/dimensions';
import { Image } from './../types/image';
import { DesignElement } from './design-element';

export class ImageModel extends DesignElement implements Image {
  dimensions = {} as Dimensions;
  private imageObj: HTMLImageElement | undefined;

  constructor(public src: string) {
    super();
    this.imageObj = new Image();
    this.imageObj.src = this.src;
  }

  renderToCanvas(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.drawImage(this.imageObj as HTMLImageElement, 100, 100);
  }

  clone(): ImageModel {
    const theClone = new ImageModel(this.src);

    theClone.dimensions = {...this.dimensions};
    theClone.isHovered = this.isHovered;
    theClone.isSelected = this.isSelected;
    theClone.metrics = {...this.metrics};
    theClone.coordinates = {...this.coordinates};
    theClone.zIndex = this.zIndex;

    return theClone;
  }
}
