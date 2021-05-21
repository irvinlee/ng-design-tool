import { ImageModel } from './models/image-model';
import { Coordinates } from './types/coordinates';
import { DesignElement } from './models/design-element';
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
  // tslint:disable-next-line:variable-name
  private _selectedElement: BehaviorSubject<DesignElement> = new BehaviorSubject({} as DesignElement);

  private undoBuffer: Array<DesignState> = [];
  private redoBuffer: Array<DesignState> = [];

  readonly MAX_BUFFER_LENGTH = 10;
  readonly currentState: Observable<DesignState> = this.designState.asObservable();
  readonly undoBufferLength: Observable<number> = this._undoBufferLength.asObservable();
  readonly redoBufferLength: Observable<number> = this._redoBufferLength.asObservable();
  readonly selectedElement: Observable<DesignElement|undefined> = this._selectedElement.asObservable();

  isResizingElement = false;

  constructor() {}

  private updateBufferLengths(): void {
    this._undoBufferLength.next(this.undoBuffer.length);
    this._redoBufferLength.next(this.redoBuffer.length);
  }

  private updateCurrentDesign(newDesign: DesignState): void {
    this.redoBuffer = [];

    console.log(newDesign);

    if (this.undoBuffer.length > this.MAX_BUFFER_LENGTH) {
      this.undoBuffer.shift();
    }

    this.undoBuffer.push(this.designState.getValue());
    console.log(this.undoBuffer);
    this.designState.next(newDesign);
    this.updateBufferLengths();
  }

  private createNewMapFromElements(): Map<string,DesignElement> {
    return new Map(this.designState.getValue().elements);
  }

  private getSelectedElement(): DesignElement {
    return this._selectedElement.getValue();
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
    newTextElement.zIndex = currentDesign.elements.size;
    elementsMap.set(generateRandomId(), newTextElement);
    this.updateCurrentDesign({...currentDesign, elements: elementsMap});
  }

  // for now, let's just use a static image by default...
  insertImage(src = 'https://www.digitalroominc.com/uploads/1/0/3/1/103161570/editor/dri-logo_2.png?1516669567'): void {
    // TODO: DRY this up...
    const currentDesign = this.designState.getValue();
    const newImageElement = new ImageModel(src);
    const elementsMap = new Map(currentDesign.elements);
    newImageElement.zIndex = currentDesign.elements.size;
    elementsMap.set(generateRandomId(), newImageElement);
    this.updateCurrentDesign({...currentDesign, elements: elementsMap});
  }

  setHoveredElement(elementId: string): void {
    if(this.isResizingElement) {
      return;
    }

    const currentDesign = this.designState.getValue();
    const newElementsMap = new Map();

    for (const [key, value] of currentDesign.elements.entries()) {
      const asDesignElement = (value as DesignElement);
      if (key === elementId) {
        asDesignElement.isHovered = true;
      } else {
        asDesignElement.isHovered = false;
      }
      newElementsMap.set(key, asDesignElement);
    }

    this.designState.next({...currentDesign, elements: newElementsMap});
  }

  selectElement(elementId: string): void {
    const currentDesign = this.designState.getValue();
    const newElementsMap = new Map();

    for (const [key, value] of currentDesign.elements.entries()) {
      const asDesignElement = (value as DesignElement);
      if (key === elementId) {
        asDesignElement.isSelected = true;
      } else {
        asDesignElement.isSelected = false;
      }
      newElementsMap.set(key, asDesignElement);
    }
    this.designState.next({...currentDesign, elements: newElementsMap});
    this._selectedElement.next(newElementsMap.get(elementId));
  }

  dragElement(elementId: string, newCoordinates: Coordinates): void {
    const newElementsMap = this.createNewMapFromElements();
    const elementToUpdate = newElementsMap.get(elementId);

    (elementToUpdate as DesignElement).coordinates = {...newCoordinates};
    newElementsMap.set(elementId, elementToUpdate as DesignElement);
    this.designState.next({...this.designState.getValue(), elements: newElementsMap});
  }

  // TODO: DRY this up later..
  dropElement(elementId: string, newCoordinates: Coordinates): void {
    const newElementsMap = this.createNewMapFromElements();
    const elementToUpdate = newElementsMap.get(elementId)?.clone();

    (elementToUpdate as DesignElement).coordinates = {...newCoordinates};
    newElementsMap.set(elementId, elementToUpdate as DesignElement);
    this.designState.next({...this.designState.getValue(), elements: newElementsMap});
  }

  resizeElement(elementId: string, mouseHandleUsed: string, mouseX: number, mouseY: number): void {
    this.isResizingElement = true;
    const newElementsMap = this.createNewMapFromElements();
    const elementToUpdate = this.getSelectedElement();
    
    elementToUpdate.resize(mouseHandleUsed, mouseX, mouseY);
    
    newElementsMap.set(elementId, elementToUpdate as DesignElement);
    this.designState.next({...this.designState.getValue(), elements: newElementsMap});
  }

  endResize(elementId: string): void {
    this.isResizingElement = false;
    this.updateCurrentDesign(this.designState.getValue());
    // create a clone of the selected element
    // to create a new reference to it so that
    // the next updates won't affect the ones stored
    // in the undo buffer
    this._selectedElement.next(this.getSelectedElement().clone());
  }
}
