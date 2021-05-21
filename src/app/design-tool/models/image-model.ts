import { ElementMouseHandles } from '../types/element-mouse-handles.enum';
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

  private resizeNW(mouseX: number, mouseY: number): void {
    this.width = this.width + (this.coordinates.left - mouseX);
    this.height = this.height + (this.coordinates.top - mouseY);
    this.coordinates.left = mouseX;
    this.coordinates.top = mouseY;
  }

  private resizeNE(mouseX: number, mouseY: number): void {
    this.width = this.width - (this.coordinates.left + this.width - mouseX);
    this.height = this.height - (this.coordinates.top + this.height - mouseY);
  }

  private resizeSW(mouseX: number, mouseY: number): void {
    this.width = this.width + (this.coordinates.left - mouseX);
    this.height = this.height + (this.coordinates.top - mouseY);
    // this.coordinates.left = mouseX;
    // this.coordinates.top = mouseY;
  }

  private resizeSE(mouseX: number, mouseY: number): void {
    this.width = this.width - (this.coordinates.left + this.width - mouseX);
    this.height = this.height - (this.coordinates.top + this.height - mouseY);
  }
  
  resize(mouseHandleUsed: string, mouseX: number, mouseY: number): void {
    switch (mouseHandleUsed) {
      case ElementMouseHandles.TOP_LEFT: this.resizeNW(mouseX, mouseY); break;
      case ElementMouseHandles.TOP_RIGHT: this.resizeNE(mouseX, mouseY); break;
      case ElementMouseHandles.BOTTOM_LEFT: this.resizeSW(mouseX, mouseY); break;
      case ElementMouseHandles.BOTTOM_RIGHT: this.resizeSE(mouseX, mouseY); break;
    }
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
