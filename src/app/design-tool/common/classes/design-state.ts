import { BehaviorSubject } from 'rxjs';
import { DesignElement } from './design-element';

export class DesignState {
  elements: Array<DesignElement | undefined> = [];

  constructor(cloneFrom?: DesignState) {
    if (!!cloneFrom) {
      this.elements = cloneFrom.elements.map(el => (el as DesignElement).clone());
    }
  }

  clone(): DesignState {
    return new DesignState(this);
  }
}
