import { TextModel } from './../../../models/text-model';
import { Shape } from './../../../types/shape';
import { Image } from './../../../types/image';
import { Text } from './../../../types/text';
import { StockImage } from './../../../types/stock-image';
import { DesignToolService } from './../../../design-tool.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ypdt-design-canvass',
  templateUrl: './design-canvass.component.html',
  styleUrls: ['./design-canvass.component.scss']
})
export class DesignCanvassComponent implements OnInit {

  public textElements: Map<string, Text> = new Map();

  constructor(private designToolService: DesignToolService) {
    this.designToolService.currentState.subscribe((canvassState) => {
      this.textElements = new Map();
      for (const [key, value] of canvassState.elements) {
        if (value instanceof TextModel) {
          this.textElements.set(key, value as Text);
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
