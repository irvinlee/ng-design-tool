import { generateRandomId } from '../utils';
import { DesignElement } from './design-element';
import { ImageElement } from './image-element';
import { TextElement } from './text-element';

export class DesignState {
  elements: Map<string, DesignElement | undefined> = new Map();

  constructor(cloneFrom?: DesignState) {
    if (!!cloneFrom) {
      // this.elements = cloneFrom.elements.map(el => (el as DesignElement).clone());
      for (const [key, value] of (cloneFrom as DesignState).elements.entries()) {
        this.elements.set(key, value?.clone());
      }
    }
  }

  insertImage(zoomLevel?: number): DesignState {
    const newImage = new ImageElement();
    newImage.zIndex = this.elements.size + 1;
    newImage.zoomLevel = zoomLevel || 1;
    this.elements.set(generateRandomId(), newImage);
    return this.clone();
  }

  insertText(zoomLevel?: number): DesignState{
    const newText = new TextElement();
    newText.zIndex = this.elements.size + 1;
    newText.zoomLevel = zoomLevel || 1;
    this.elements.set(generateRandomId(), newText);
    return this.clone();
  }

  setElementZoomLevel(zoomLevel = 1): DesignState {
    for (const [key, value] of this.elements.entries()) {
      (value as DesignElement).zoomLevel = zoomLevel;
    }

    return this.clone();
  }

  clone(): DesignState {
    return new DesignState(this);
  }
}
