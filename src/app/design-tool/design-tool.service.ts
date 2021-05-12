import { DesignState } from './types/design-state';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignToolService {
  private designState: BehaviorSubject<DesignState> = new BehaviorSubject({});
  // tslint:disable-next-line:variable-name
  private _undoBufferLength: BehaviorSubject<number> = new BehaviorSubject(0);
  // tslint:disable-next-line:variable-name
  private _redoBufferLength: BehaviorSubject<number> = new BehaviorSubject(0);

  private undoBuffer: Array<DesignState> = [];
  private redoBuffer: Array<DesignState> = [];

  readonly MAX_BUFFER_LENGTH = 10;
  readonly currentState: Observable<DesignState> = this.designState.asObservable();
  readonly undoBufferLength: Observable<number> = this._undoBufferLength.asObservable();
  readonly redoBufferLength: Observable<number> = this._redoBufferLength.asObservable();

  constructor() {}

  private updateBufferLengths(): void {
    this._undoBufferLength.next(this.undoBuffer.length);
    this._redoBufferLength.next(this.redoBuffer.length);
  }

  undo(): void {
    if (this.undoBuffer.length) {
      const previousDesignState = this.undoBuffer.pop() as DesignState;

      this.redoBuffer.push(this.designState.getValue());
      this.designState.next(previousDesignState);
      this.updateBufferLengths();
    }
  }

  redo(): void {
    if (this.redoBuffer.length) {
      const nextDesignState = this.redoBuffer.pop() as DesignState;

      this.undoBuffer.push(this.designState.getValue());
      this.designState.next(nextDesignState);
      this.updateBufferLengths();
    }
  }

  update(newDesign: DesignState): void {
    this.redoBuffer = [];
    this.undoBuffer.shift();
    this.undoBuffer.push(this.designState.getValue());
    this.designState.next(newDesign);
    this.updateBufferLengths();
  }
}
