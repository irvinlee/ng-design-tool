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

}
