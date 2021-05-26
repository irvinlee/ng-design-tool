import { BehaviorSubject } from 'rxjs';
import { DesignElement } from './design-element';
import { ImageElement } from './image-element';
import { TextElement } from './text-element';

export class DesignState {
  elements: Array<DesignElement | undefined> = [];

  constructor(cloneFrom?: DesignState) {
    if (!!cloneFrom) {
      this.elements = cloneFrom.elements.map(el => (el as DesignElement).clone());
    }
  }

  insertImage(): DesignState {
    this.elements.push(new ImageElement());
    return this.clone();
  }

  insertText(): DesignState{
    this.elements.push(new TextElement());
    return this.clone();
  }

  clone(): DesignState {
    return new DesignState(this);
  }
}
