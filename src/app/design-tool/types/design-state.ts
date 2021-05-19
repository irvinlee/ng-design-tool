import { DesignElement } from './design-element';

export interface DesignState {
  elements: Map<string, DesignElement>;
}
