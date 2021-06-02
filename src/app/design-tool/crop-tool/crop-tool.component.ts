import { ElementMouseHandles } from './../types/element-mouse-handles.enum';
import { CropParams } from './../types/crop-params';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { generateRandomId } from '../common/utils';

@Component({
  selector: 'app-crop-tool',
  templateUrl: './crop-tool.component.html',
  styleUrls: ['./crop-tool.component.scss']
})
export class CropToolComponent implements OnInit, AfterViewInit {
  @Input() left = 0;
  @Input() top = 0;
  @Input() width = 0;
  @Input() height = 0;

  @Output() crop = new EventEmitter<CropParams>();

  id = generateRandomId();
  cropParams: CropParams = {left: 0, top: 0, width: 0, height: 0};
  wrapperRef?: HTMLElement;

  constructor() { }

  ngOnInit(): void {
    this.cropParams = {left: this.left, top: this.top, width: this.width, height: this.height};
  }

  ngAfterViewInit(): void {
    this.wrapperRef = document.getElementById(this.id) as HTMLElement;
  }

  private resizeNW(event: DragEvent): void {
    const {left, top, width, height} = this.cropParams;
    const { clientX, clientY } = event;

    this.cropParams.left = clientX;
    this.cropParams.top = clientY;

    this.cropParams.width = width + (left - clientX);
    this.cropParams.height = height + (top - clientY);
  }

  private resizeNE(event: DragEvent): void {
    const {left, top, width, height} = this.cropParams;
    const { clientX, clientY } = event;

    this.cropParams.top = clientY;
    this.cropParams.width = width - (left + width - clientX);
    this.cropParams.height = height + (top - clientY);
  }

  private resizeSW(event: DragEvent): void {
    const {left, top, width, height} = this.cropParams;
    const { clientX, clientY } = event;

    this.cropParams.left = clientX;
    this.cropParams.width = width + (left - clientX);
    this.cropParams.height = height - (top + height - clientY);
  }

  private resizeSE(event: DragEvent): void {
    const {left, top, width, height} = this.cropParams;
    const { clientX, clientY } = event;

    this.cropParams.width = width - (left + width - clientX);
    this.cropParams.height = height - (top + height - clientY);
  }

  resize(mouseHandleUsed: string, event: DragEvent): void {
    switch (mouseHandleUsed) {
      case ElementMouseHandles.TOP_LEFT: this.resizeNW(event); break;
      case ElementMouseHandles.TOP_RIGHT: this.resizeNE(event); break;
      case ElementMouseHandles.BOTTOM_LEFT: this.resizeSW(event); break;
      case ElementMouseHandles.BOTTOM_RIGHT: this.resizeSE(event); break;
    }
  }

  onResizeHandleDrag(handle: string, event: DragEvent): void {
    this.resize(handle, event);
  }

  onResizeHandleDragEnd(handle: string, event: DragEvent): void {
    this.resize(handle, event);
  }

  cropNow(): void {
    this.crop.emit({
      left: this.cropParams.left - this.left,
      top: this.cropParams.top - this.top,
      width: this.cropParams.width,
      height: this.cropParams.height
    });
  }
}
