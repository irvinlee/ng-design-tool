import { DesignElement } from '../models/design-element';

export interface DesignState {
  elements: Map<string, DesignElement>;
}
