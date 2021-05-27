import { Injectable, ɵɵsetComponentScope } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DesignState } from './common/classes/design-state';

@Injectable({
  providedIn: 'root'
})
export class DesignToolService {
  private undoBufferLengthSubject = new BehaviorSubject<number>(0);
  private redoBufferLengthSubject = new BehaviorSubject<number>(0);
  private designStateSubject = new BehaviorSubject(new DesignState());
  private undoBuffer: Array<DesignState> = [];
  private redoBuffer: Array<DesignState> = [];

  readonly MAX_BUFFER_LENGTH = 10;
  undoBufferLength = this.undoBufferLengthSubject.asObservable();
  redoBufferLength = this.redoBufferLengthSubject.asObservable();
  designState = this.designStateSubject.asObservable();

  private emitBufferLengthUpdates(): void {
    this.undoBufferLengthSubject.next(this.undoBuffer.length);
    this.redoBufferLengthSubject.next(this.redoBuffer.length);
  }

  insertImage(): void {
    const newDesignState = new DesignState(this.designStateSubject.getValue());
    this.updateDesignState(newDesignState.insertImage());
  }

  insertText(): void {
    const newDesignState = new DesignState(this.designStateSubject.getValue());
    this.updateDesignState(newDesignState.insertText());
  }

  undo(): void {
    if (this.undoBuffer.length) {
      const stateFromUndoBuffer = this.undoBuffer.pop() as DesignState;
      this.redoBuffer.push(this.designStateSubject.getValue().clone());
      this.designStateSubject.next(stateFromUndoBuffer);
      this.emitBufferLengthUpdates();
    }
  }

  redo(): void {
    if (this.redoBuffer.length) {
      const stateFromRedoBuffer = this.redoBuffer.pop() as DesignState;
      this.undoBuffer.push(this.designStateSubject.getValue().clone());
      this.designStateSubject.next(stateFromRedoBuffer);
      this.emitBufferLengthUpdates();
    }
  }

  updateDesignState(newDesignState: DesignState): void {
    if (this.undoBuffer.length + 1 > this.MAX_BUFFER_LENGTH) {
      this.undoBuffer.shift();
    }
    this.undoBuffer.push(this.designStateSubject.getValue().clone());
    this.designStateSubject.next(newDesignState);
    this.undoBufferLengthSubject.next(this.undoBuffer.length);
    this.redoBuffer = [];
    this.redoBufferLengthSubject.next(0);
  }
}
