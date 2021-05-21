import { DesignElement } from './design-element';
import { Dimensions } from './../types/dimensions';
import { TextFormat } from './../types/text-format';
import { Text } from './../types/text';
import { TextAlign } from '../types/text-align.enum';
import { ElementMouseHandles } from '../types/element-mouse-handles.enum';

export class TextModel extends DesignElement implements Text{
  value = 'New Text Element';

  format = {
    font: 'Arial',
    size: 12,
    color: '#000',
    opacity: 100,
    bgColor: '#FFF',
    isBold: false,
    isItalic: false,
    alignment: TextAlign.LEFT
  } as TextFormat;

  constructor() {
    super();
  }

  renderToCanvas(canvasContext: CanvasRenderingContext2D): void{
    canvasContext.textBaseline = 'bottom';
    canvasContext.fillStyle = this.format.color;
    canvasContext.font = `${this.format.size}px ${this.format.font}`;
    const metrics = canvasContext.measureText(this.value);

    this.dimensions.width = metrics.width;
    this.dimensions.height = metrics.actualBoundingBoxAscent;

    canvasContext.fillText(this.value, this.coordinates.left, this.coordinates.top + this.dimensions.height);

    if (this.isHovered || this.isSelected) {
      this.displayOutline(canvasContext);
    }

    if(this.isSelected) {
      this.displayResizeHandles(canvasContext);
    }
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
    console.log(this);
  }

  clone(): TextModel {
    const theClone = new TextModel();

    theClone.value = this.value;
    theClone.format = {...this.format};
    theClone.dimensions = {...this.dimensions};
    theClone.isHovered = this.isHovered;
    theClone.isSelected = this.isSelected;
    theClone.coordinates = {...this.coordinates};
    theClone.zIndex = this.zIndex;

    return theClone;
  }
}
