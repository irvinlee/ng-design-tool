import { ElementMouseHandles } from './../types/element-mouse-handles.enum';
import { CropParams } from './../types/crop-params';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-crop-tool',
  templateUrl: './crop-tool.component.html',
  styleUrls: ['./crop-tool.component.scss']
})
export class CropToolComponent implements OnInit {
  @Input() left = 0;
  @Input() top = 0;
  @Input() width = 0;
  @Input() height = 0;

  @Output() crop = new EventEmitter<CropParams>();

  cropParams: CropParams = {left: 0, top: 0, width: 0, height: 0};

  constructor() { }

  ngOnInit(): void {
    this.cropParams = {left: this.left, top: this.top, width: this.width, height: this.height};
  }

  private resizeNW(mouseX: number, mouseY: number): void {
    const oldYCoord = this.cropParams.top as number;
    const oldXCoord = this.cropParams.left as number;
    const width = (this.cropParams.width as number);
    const height = (this.cropParams.height as number);

    this.cropParams.left = mouseX;
    this.cropParams.top = mouseY;

    this.cropParams.width = width + (oldXCoord - this.left);
    this.cropParams.height = height + (oldYCoord - this.top);
  }

  private resizeNE(mouseX: number, mouseY: number): void {
    const oldYCoord = this.cropParams.top as number;
    const width = (this.cropParams.width as number);
    const height = (this.cropParams.height as number);

    this.cropParams.top = mouseY;
    this.cropParams.width = width - ((this.cropParams.left as number) + width - mouseX);
    this.cropParams.height = height + (oldYCoord - this.cropParams.top);
  }

  private resizeSW(mouseX: number, mouseY: number): void {
    const oldXCoord = this.cropParams.left as number;
    const width = (this.cropParams.width as number);
    const height = (this.cropParams.height as number);

    this.cropParams.left = mouseX;
    this.cropParams.width = width + (oldXCoord - (this.cropParams.left as number));
    this.cropParams.height = height - ((this.cropParams.top as number) + height - mouseY);
  }

  private resizeSE(mouseX: number, mouseY: number): void {
    const width = (this.cropParams.width as number);
    const height = (this.cropParams.height as number);

    this.cropParams.width = width - ((this.cropParams.left as number) + width - mouseX);
    this.cropParams.height = height - ((this.top as number) + height - mouseY);
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
