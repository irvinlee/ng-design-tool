import { TextModel } from './../../../models/text-model';
import { Shape } from './../../../types/shape';
import { Image } from './../../../types/image';
import { Text } from './../../../types/text';
import { StockImage } from './../../../types/stock-image';
import { DesignToolService } from './../../../design-tool.service';
import { Component, OnInit, Input } from '@angular/core';
import { generateRandomId } from '../../../common/utils';

@Component({
  selector: 'app-ypdt-design-canvas',
  templateUrl: './design-canvas.component.html',
  styleUrls: ['./design-canvas.component.scss']
})
export class DesigncanvasComponent implements OnInit {
  @Input() width = 300;
  @Input() height = 150;
  readonly id = generateRandomId();

  public textElements: Map<string, Text> = new Map();

  constructor(private designToolService: DesignToolService) {
    this.designToolService.currentState.subscribe((canvasState) => {
      this.textElements = new Map();
      for (const [key, value] of canvasState.elements) {
        if (value instanceof TextModel) {
          this.textElements.set(key, value as Text);
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
