import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DesignState } from './common/classes/design-state';

@Injectable({
  providedIn: 'root'
})
export class DesignToolService {
  private undoBufferLengthBehavior = new BehaviorSubject<number>(0);
  private redoBufferLengthBehavior = new BehaviorSubject<number>(0);
  private designStateBehavior = new BehaviorSubject(new DesignState());
  private undoBuffer: Array<DesignState> = [];
  private redoBuffer: Array<DesignState> = [];

  readonly MAX_BUFFER_LENGTH = 10;
  undoBufferLength = this.undoBufferLengthBehavior.asObservable();
  redoBufferLength = this.redoBufferLengthBehavior.asObservable();
  designState = this.designStateBehavior.asObservable();

  private emitBufferLengthUpdates(): void {
    this.undoBufferLengthBehavior.next(this.undoBuffer.length);
    this.redoBufferLengthBehavior.next(this.redoBuffer.length);
  }

  insertImage(): void {
    this.updateDesignState(this.designStateBehavior.getValue().insertImage());
  }

  insertText(): void {
    this.updateDesignState(this.designStateBehavior.getValue().insertText());
  }

  undo(): void {
    if (this.undoBuffer.length) {
      const stateFromUndoBuffer = this.undoBuffer.pop() as DesignState;
      this.redoBuffer.push(this.designStateBehavior.getValue().clone());
      this.designStateBehavior.next(stateFromUndoBuffer);
      this.emitBufferLengthUpdates();
    }
  }

  redo(): void {
    if (this.redoBuffer.length) {
      const stateFromRedoBuffer = this.redoBuffer.pop() as DesignState;
      this.undoBuffer.push(this.designStateBehavior.getValue().clone());
      this.designStateBehavior.next(stateFromRedoBuffer);
      this.emitBufferLengthUpdates();
    }
  }

  updateDesignState(newDesignState: DesignState): void {
    if (this.undoBuffer.length + 1 > this.MAX_BUFFER_LENGTH) {
      this.undoBuffer.shift();
    }
    this.undoBuffer.push(this.designStateBehavior.getValue().clone());
    this.designStateBehavior.next(newDesignState.clone());
    this.undoBufferLengthBehavior.next(this.undoBuffer.length);
  }
}
