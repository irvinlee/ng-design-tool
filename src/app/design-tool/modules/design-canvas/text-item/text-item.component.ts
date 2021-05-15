import { TextModel } from './../../../models/text-model';
import { Text } from './../../../types/text';
import { Component, OnInit, Input, ɵɵsetComponentScope, ɵɵtrustConstantResourceUrl } from '@angular/core';

@Component({
  selector: 'app-text-item',
  templateUrl: './text-item.component.html',
  styleUrls: ['./text-item.component.scss']
})
export class TextItemComponent implements OnInit {
  @Input() id = '';
  @Input() data: Text = new TextModel();
  // tslint:disable-next-line:variable-name
  private _elementRef!: HTMLElement | SVGElement;
  // tslint:disable-next-line:variable-name
  private _isDragging = false;

  className = [''];

  constructor() { }

  ngOnInit(): void {
    this.className.push(`text-item-${this.id}`);
  }

  onInitElement({node}: {node: HTMLElement | SVGElement}): void {
    this._elementRef = node;

    this._elementRef.addEventListener('mousedown', (event) => {
      this.handleStartDrag(event as MouseEvent);
    });

    this._elementRef.addEventListener('mouseup', (event) => {
      this.handleEndDrag(event as MouseEvent);
    });

    this._elementRef.addEventListener('mousemove', (event) => {

    });

    console.log(this._elementRef);
  }

  handleStartDrag($event: MouseEvent): void {
    this._isDragging = true;
    // this._elementRef.setAttribute('style', '');
    console.log(this._isDragging);
  }

  handleEndDrag($event: MouseEvent): void {
    this._isDragging = false;
    console.log(this._isDragging);
  }

  handleMouseMove($event: MouseEvent): void {
    if (this._isDragging) {
      console.log($event.movementX + ' - ' + $event.movementX);
    }
  }
}
