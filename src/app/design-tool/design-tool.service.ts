import { TextModel } from './models/text-model';
import { generateRandomId } from './common/utils';
import { DesignState } from './types/design-state';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignToolService {
  private designState: BehaviorSubject<DesignState> = new BehaviorSubject({elements: new Map()});
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

  private updateCurrentDesign(newDesign: DesignState): void {
    this.redoBuffer = [];

    if (this.undoBuffer.length > this.MAX_BUFFER_LENGTH) {
      this.undoBuffer.shift();
    }

    this.undoBuffer.push(this.designState.getValue());
    this.designState.next(newDesign);
    this.updateBufferLengths();
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

  insertText(): void {
    const currentDesign = this.designState.getValue();
    const newTextElement = new TextModel();
    const elementsMap = new Map(currentDesign.elements);

    elementsMap.set(generateRandomId(), newTextElement);
    this.updateCurrentDesign({...currentDesign, elements: elementsMap});
  }

  setHoveredEls(elementIds: Array<string>): void {
    const currentDesign = this.designState.getValue();
    const newElementsMap = new Map();
    const idHashTable = new Set(elementIds);

    for (const [key, value] of currentDesign.elements.entries()) {
      const asTextModel = (value as TextModel);
      if (idHashTable.has(key)) {
        asTextModel.isHovered = true;
      } else {
        asTextModel.isHovered = false;
      }
      newElementsMap.set(key, asTextModel);
    }
    console.log(newElementsMap);
    this.designState.next({...currentDesign, elements: newElementsMap});
  }
}
