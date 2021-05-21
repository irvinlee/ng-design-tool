import { ElementMouseHandles } from './../../../types/element-mouse-handles.enum';
import { HoveredElement } from './../../../types/hovered-element';
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

  private updateCanvasMouseCursor(hoveredEl: HoveredElement): void {
    let cursor = 'default';

    if (hoveredEl.key) {
      if (!hoveredEl.mouseHandle) {
        cursor = 'pointer';
      } else {
        if ([ElementMouseHandles.TOP_LEFT, ElementMouseHandles.BOTTOM_RIGHT].indexOf(hoveredEl.mouseHandle) >= 0) {
          cursor = 'nwse-resize';
        } else {
          cursor = 'nesw-resize';
        }
      }
    }

    (document.getElementById(this.id) as HTMLElement).style.cursor = cursor;
  }

  ngAfterViewInit(): void {
    this._canvasElement = document.getElementById(this.id) as HTMLCanvasElement;
    this._renderer = new Renderer(this._canvasElement);
    this._subscriptions.push(this._renderer.mouseHoverObservable.subscribe((hoveredEl) => {
      if (hoveredEl.key) {
        this.updateCanvasMouseCursor(hoveredEl);
        this.designToolService.setHoveredElement(hoveredEl.key);
      }
    }));

    this._subscriptions.push(this._renderer.mouseClickObservable.subscribe((clickedEl) => {
      if (clickedEl) {
        this.designToolService.selectElement(clickedEl);
      }
    }));

    this._subscriptions.push(this._renderer.elementDragObservable.subscribe((event: ElementDragEvent) => {
      if (event.element?.key)  {
        if (!event.element.mouseHandle) {
          this.designToolService.dragElement(event.element?.key, {left: event.x, top: event.y});
        } else {
          const { key, mouseHandle } = event.element;
          this.designToolService.resizeElement(key, mouseHandle, event.x, event.y);
        }
      }
    }));

    this._subscriptions.push(this._renderer.elementDropObservable.subscribe((event: ElementDragEvent) => {
      if (event.element?.key)  {
        if (!event.element.mouseHandle) {
          this.designToolService.dropElement(event.element?.key, {left: event.x, top: event.y});
        } else {
          this.designToolService.endResize(event.element.key);
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
    this._renderer?.destroy();
  }
}
