import { Renderer } from './../renderer';
import { TextModel } from './../../../models/text-model';
import { Shape } from './../../../types/shape';
import { Image } from './../../../types/image';
import { Text } from './../../../types/text';
import { StockImage } from './../../../types/stock-image';
import { DesignToolService } from './../../../design-tool.service';
import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { generateRandomId } from '../../../common/utils';

@Component({
  selector: 'app-ypdt-design-canvas',
  templateUrl: './design-canvas.component.html',
  styleUrls: ['./design-canvas.component.scss']
})
export class DesignCanvasComponent implements AfterViewInit, OnDestroy{
  @Input() width = 300;
  @Input() height = 150;
  readonly id = generateRandomId();
  // tslint:disable-next-line:variable-name
  private _renderer: Renderer | undefined;
  // tslint:disable-next-line:variable-name
  private _canvasElement: HTMLCanvasElement | undefined;

  constructor(private designToolService: DesignToolService) {
    this.designToolService.currentState.subscribe((canvasState) => {
      this._renderer?.setElements(canvasState.elements);
    });
  }

  ngAfterViewInit(): void {
    this._canvasElement = document.getElementById(this.id) as HTMLCanvasElement;
    this._renderer = new Renderer(this._canvasElement);
    this._renderer.mouseHoverObservable.subscribe((hoveredEls) => {
      if (hoveredEls.length) {
        (document.getElementById(this.id) as HTMLElement).style.cursor = 'pointer';
      } else {
        (document.getElementById(this.id) as HTMLElement).style.cursor = 'default';
      }
      this.designToolService.setHoveredEls(hoveredEls);
    });
  }

  ngOnDestroy(): void {
    this._renderer?.destroy();
  }
}
