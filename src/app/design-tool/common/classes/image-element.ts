import { degToRad } from '../utils';
import { ElementMouseHandles } from './../../types/element-mouse-handles.enum';
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

    const left = this.left as number;
    const top = this.top as number;
    const width = this.width as number;
    const height = this.height as number;

    canvasContext.save();
    const xCenter = left + (width / 2);
    const yCenter = top + (height / 2);
    const angle = degToRad(this.bearing);

    canvasContext.translate(xCenter, yCenter);
    canvasContext.rotate(angle);

    canvasContext.drawImage(
      this.imageObj as HTMLImageElement,
       -width / 2,
      -height / 2,
      this.width as number,
      this.height as number
    );

    if (this.isHovered || this.isSelected) {
      this.displayOutline(canvasContext);
    }

    canvasContext.rotate(-angle);
    canvasContext.translate(-xCenter, -yCenter);

    if (this.isSelected) {
      this.renderResizeHandles(canvasContext);
    }

    canvasContext.restore();
    return this;
  }

  private resizeNW(mouseX: number, mouseY: number): void {
    const oldYCoord = this.top as number;
    const oldXCoord = this.left as number;
    const width = (this.width as number);
    const height = (this.height as number);

    this.left = mouseX;
    this.top = mouseY;

    this.width = width + (oldXCoord - this.left);
    this.height = height + (oldYCoord - this.top);
  }

  private resizeNE(mouseX: number, mouseY: number): void {
    const oldYCoord = this.top as number;
    const width = (this.width as number);
    const height = (this.height as number);

    this.top = mouseY;
    this.width = width - ((this.left as number) + width - mouseX);
    this.height = height + (oldYCoord - this.top);
  }

  private resizeSW(mouseX: number, mouseY: number): void {
    const oldXCoord = this.left as number;
    const width = (this.width as number);
    const height = (this.height as number);

    this.coordinates.left = mouseX;
    this.width = width + (oldXCoord - (this.left as number));
    this.height = height - ((this.top as number) + height - mouseY);
  }

  private resizeSE(mouseX: number, mouseY: number): void {
    const width = (this.width as number);
    const height = (this.height as number);

    this.width = width - ((this.left as number) + width - mouseX);
    this.height = height - ((this.top as number) + height - mouseY);
  }

  resize(mouseHandleUsed: string, mouseX: number, mouseY: number): void {
    switch (mouseHandleUsed) {
      case ElementMouseHandles.TOP_LEFT: this.resizeNW(mouseX, mouseY); break;
      case ElementMouseHandles.TOP_RIGHT: this.resizeNE(mouseX, mouseY); break;
      case ElementMouseHandles.BOTTOM_LEFT: this.resizeSW(mouseX, mouseY); break;
      case ElementMouseHandles.BOTTOM_RIGHT: this.resizeSE(mouseX, mouseY); break;
    }
  }
}
