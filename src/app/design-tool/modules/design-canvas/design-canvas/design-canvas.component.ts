import { ElementDragEvent } from './../../../types/element-drag-event';
import { Renderer } from './../renderer';
import { DesignToolService } from './../../../design-tool.service';
import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { generateRandomId } from '../../../common/utils';
import { Subscription } from 'rxjs';

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
  // tslint:disable-next-line:variable-name
  private _subscriptions: Array<Subscription> = [];

  constructor(private designToolService: DesignToolService) {
    this.designToolService.currentState.subscribe((canvasState) => {
      this._renderer?.setElements(canvasState.elements);
    });
  }

  ngAfterViewInit(): void {
    this._canvasElement = document.getElementById(this.id) as HTMLCanvasElement;
    this._renderer = new Renderer(this._canvasElement);
    this._subscriptions.push(this._renderer.mouseHoverObservable.subscribe((hoveredEls) => {
      if (hoveredEls.length) {
        (document.getElementById(this.id) as HTMLElement).style.cursor = 'pointer';
      } else {
        (document.getElementById(this.id) as HTMLElement).style.cursor = 'default';
      }
      this.designToolService.setHoveredElement(hoveredEls);
    }));

    this._subscriptions.push(this._renderer.mouseClickObservable.subscribe((clickedEl) => {
      this.designToolService.selectElement(clickedEl);
    }));

    this._subscriptions.push(this._renderer.elementDragObservable.subscribe((event: ElementDragEvent) => {
      if (event.elementKey)  {
        this.designToolService.moveElement(event.elementKey, {left: event.x, top: event.y});
      }
    }));
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
    this._renderer?.destroy();
  }
}
