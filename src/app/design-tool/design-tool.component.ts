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

  getDesignUpdateStack(stackHeight: number): Array<DesignState | undefined>{
    return this.designState.slice(Math.max(this.designState.length - stackHeight, 0));
  }

  onUndo(): void {
    if (this.designState.length) {
      // not doing simple array.push/pop here to avoid mutation...
      this.undoBuffer = [...this.undoBuffer, this.designState[this.designState.length - 1]];
      this.designState = this.designState.slice(0, this.designState.length - 1);
    }
  }

  onRedo(): void {
    if (this.undoBuffer.length) {
      this.designState = [...this.getDesignUpdateStack(this.MAX_BUFFER_LENGTH - 1), this.undoBuffer[this.undoBuffer.length - 1]];
      this.undoBuffer = this.undoBuffer.slice(0, this.undoBuffer.length - 1);
    }
  }

  onUpdate(newDesign: DesignState): void {
    // get the last n + 1 (where n < MAX_BUFFER_LENGTH) updates and append the latest update
    const newDesignState =  [...this.getDesignUpdateStack(this.MAX_BUFFER_LENGTH - 1), newDesign];
    this.designState = newDesignState;
    this.undoBuffer = [];
  }

  onInsertElement(newElement: DesignState): void {

  }
}
