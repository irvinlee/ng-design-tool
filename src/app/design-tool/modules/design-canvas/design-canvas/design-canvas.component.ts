import { Renderer } from './../renderer';
import { TextModel } from './../../../models/text-model';
import { Shape } from './../../../types/shape';
import { Image } from './../../../types/image';
import { Text } from './../../../types/text';
import { StockImage } from './../../../types/stock-image';
import { DesignToolService } from './../../../design-tool.service';
import { Component, Input, AfterViewInit,  } from '@angular/core';
import { generateRandomId } from '../../../common/utils';

@Component({
  selector: 'app-ypdt-design-canvas',
  templateUrl: './design-canvas.component.html',
  styleUrls: ['./design-canvas.component.scss']
})
export class DesignCanvasComponent implements AfterViewInit{
  @Input() width = 300;
  @Input() height = 150;
  readonly id = generateRandomId();
  // tslint:disable-next-line:variable-name
  private _renderer: Renderer | undefined;

  constructor(private designToolService: DesignToolService) {
    this.designToolService.currentState.subscribe((canvasState) => {
      this._renderer?.renderElements(canvasState.elements);
    });
  }

  ngAfterViewInit(): void {
    this._renderer = new Renderer(document.getElementById(this.id) as HTMLCanvasElement);
  }
}
