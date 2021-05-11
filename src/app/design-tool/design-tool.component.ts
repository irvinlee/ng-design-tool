import { DesignState } from './types/design-state';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ypdt-design-tool',
  templateUrl: './design-tool.component.html',
  styleUrls: ['./design-tool.component.scss']
})
export class DesignToolComponent implements OnInit {
  private designState: Array<DesignState | undefined> = [];
  private undoBuffer: Array<DesignState | undefined> = [];
  readonly MAX_BUFFER_LENGTH = 10;

  constructor() {}

  ngOnInit(): void {
  }

  onUndo(): void {
    if (this.designState.length > 1) {
      // not doing simple array.push/pop here to avoid mutation...
      this.undoBuffer = [...this.undoBuffer, this.designState[this.designState.length]];
    }
  }

  onUpdate(newDesign: DesignState): void {
    // get the last n + 1 (where n < MAX_BUFFER_LENGTH) updates and append the latest update
    const newDesignState =  [...this.designState.slice(Math.max(this.designState.length - this.MAX_BUFFER_LENGTH + 1, 0)), newDesign];
    this.designState = newDesignState;
    this.undoBuffer = [];
  }
}
