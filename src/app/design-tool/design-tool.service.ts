import { ImageElement } from './common/classes/image-element';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DesignState } from './common/classes/design-state';

@Injectable({
  providedIn: 'root'
})
export class DesignToolService {
  private undoBufferLengthSubject = new BehaviorSubject<number>(0);
  private redoBufferLengthSubject = new BehaviorSubject<number>(0);
  private zoomLevelSubject = new BehaviorSubject<number>(1);
  private designStateSubject = new BehaviorSubject(new DesignState());
  private canCropSubject = new BehaviorSubject(false);
  private isCroppingSubject = new BehaviorSubject(false);

  private undoBuffer: Array<DesignState> = [];
  private redoBuffer: Array<DesignState> = [];
  private selectedElementKey = '';

  readonly MAX_BUFFER_LENGTH = 10;
  undoBufferLength = this.undoBufferLengthSubject.asObservable();
  redoBufferLength = this.redoBufferLengthSubject.asObservable();
  designState = this.designStateSubject.asObservable();
  zoomLevel = this.zoomLevelSubject.asObservable();
  canCrop = this.canCropSubject.asObservable();
  isCropping = this.isCroppingSubject.asObservable();

  private emitBufferLengthUpdates(): void {
    this.undoBufferLengthSubject.next(this.undoBuffer.length);
    this.redoBufferLengthSubject.next(this.redoBuffer.length);
  }

  private getCurrentDesignState(): DesignState {
    return this.designStateSubject.getValue();
  }

  insertImage(): void {
    const newDesignState = new DesignState(this.getCurrentDesignState());
    this.updateDesignState(newDesignState.insertImage());
  }

  insertText(): void {
    const newDesignState = new DesignState(this.getCurrentDesignState());
    this.updateDesignState(newDesignState.insertText());
  }

  undo(): void {
    if (this.undoBuffer.length) {
      const stateFromUndoBuffer = this.undoBuffer.pop() as DesignState;
      this.redoBuffer.push(this.getCurrentDesignState().clone());
      this.designStateSubject.next(stateFromUndoBuffer);
      this.emitBufferLengthUpdates();
    }
  }

  redo(): void {
    if (this.redoBuffer.length) {
      const stateFromRedoBuffer = this.redoBuffer.pop() as DesignState;
      this.undoBuffer.push(this.getCurrentDesignState().clone());
      this.designStateSubject.next(stateFromRedoBuffer);
      this.emitBufferLengthUpdates();
    }
  }

  updateDesignState(newDesignState: DesignState, isOnlyChangingZoomLevel = false): void {
    if (isOnlyChangingZoomLevel) {
      this.designStateSubject.next(newDesignState.setElementZoomLevel(this.getCurrentZoomLevel()));
    } else {
      if (this.undoBuffer.length + 1 > this.MAX_BUFFER_LENGTH) {
        this.undoBuffer.shift();
      }
      this.undoBuffer.push(this.getCurrentDesignState().clone());
      this.designStateSubject.next(newDesignState.setElementZoomLevel(this.getCurrentZoomLevel()));
      this.undoBufferLengthSubject.next(this.undoBuffer.length);
      this.redoBuffer = [];
      this.redoBufferLengthSubject.next(0);
    }
  }

  getCurrentZoomLevel(): number {
    return this.zoomLevelSubject.getValue();
  }

  setZoomLevel(zoomLevel: number): void {
    this.zoomLevelSubject.next(zoomLevel);
    this.updateDesignState(this.getCurrentDesignState(), true);
  }

  setSelectedElementKey(elementKey: string): void {
    this.selectedElementKey = elementKey;
    this.updateCanCropStatus();
  }

  toggleCroppingMode(): void {
    if (this.canCropSubject.getValue()) {
      this.isCroppingSubject.next(!this.isCroppingSubject.getValue());
    }
  }

  private updateCanCropStatus(): void{
    if (this.getCurrentDesignState().elements.get(this.selectedElementKey) instanceof ImageElement) {
      this.canCropSubject.next(true);
    } else {
      this.canCropSubject.next(false);
    }
  }
}
