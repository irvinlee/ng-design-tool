import { ElementMouseHandles } from './../types/element-mouse-handles.enum';
import { ResizeHandles } from './resize-handles';
import { CanvasGenericElement } from './canvas-generic-element';

export abstract class DesignElement extends CanvasGenericElement {
  isHovered = false;
  isSelected = false;
  zIndex = 0;
  resizeHandles = new ResizeHandles();

  constructor() {
    super();
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

  displayOutline(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.beginPath();
    canvasContext.rect(
      this.coordinates.left - 5,
      this.coordinates.top - 5,
      this.width + 10,
      this.height + 5
    );
    canvasContext.stroke();
  }

  displayResizeHandles(canvasContext: CanvasRenderingContext2D): void {
    this.resizeHandles.setPosition(this.coordinates.left - 5, this.coordinates.top - 5, this.width + 10, this.height + 5);
    this.resizeHandles.renderToCanvas(canvasContext);
  }

  resize(mouseHandleUsed: string, mouseX: number, mouseY: number): void {
    switch (mouseHandleUsed) {
      case ElementMouseHandles.TOP_LEFT: this.resizeNW(mouseX, mouseY); break;
      case ElementMouseHandles.TOP_RIGHT: this.resizeNE(mouseX, mouseY); break;
      case ElementMouseHandles.BOTTOM_LEFT: this.resizeSW(mouseX, mouseY); break;
      case ElementMouseHandles.BOTTOM_RIGHT: this.resizeSE(mouseX, mouseY); break;
    }
  }

  abstract renderToCanvas(canvasContext: CanvasRenderingContext2D): void;
  abstract clone(): DesignElement;
}
