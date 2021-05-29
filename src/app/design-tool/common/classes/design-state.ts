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
    const newImage = new ImageElement();
    newImage.zIndex = this.elements.length + 1;
    this.elements.push(newImage);
    return this.clone();
  }

  insertText(): DesignState{
    const newText = new TextElement();
    newText.zIndex = this.elements.length + 1;

    this.elements.push(newText);
    return this.clone();
  }

  clone(): DesignState {
    return new DesignState(this);
  }
}
