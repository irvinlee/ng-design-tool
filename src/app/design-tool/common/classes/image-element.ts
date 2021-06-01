import { degToRad, getBearing, getCoordinatesAfterRotation } from '../utils';
import { ElementMouseHandles } from './../../types/element-mouse-handles.enum';
import { DesignElement } from './design-element';

const defaultImage = 'https://d2q79iu7y748jz.cloudfront.net/s/_logo/6ebd19753ce733b2f41a9b85de5f5774';

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
      elementToClone.bearing,
      elementToClone.zoomLevel,
      elementToClone.eventListeners
    );

    this.src = elementToClone.src || defaultImage;
    this.imageObj = elementToClone.imageObj;
    this.isImageLoaded = elementToClone.isImageLoaded;
    this.isLoadingImage = elementToClone.isLoadingImage;
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
    const xCenter = this.midpointX as number;
    const yCenter = this.midpointY as number;
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

    this.left = mouseX;
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

  rotate(baseElement: DesignElement, mouseX: number, mouseY: number): void {
    this.resizeHandles.rotateHandle.top = mouseY - 4;
    this.resizeHandles.rotateHandle.left = mouseX - 4;

    const rotatedPosition = getCoordinatesAfterRotation(
      baseElement.left as number,
      baseElement.top as number,
      baseElement.bearing,
      baseElement.midpointX,
      baseElement.midpointY
    );

    this.bearing = getBearing(
      rotatedPosition.x as number,
      rotatedPosition.y as number,
      mouseX,
      mouseY
    );
  }
}
