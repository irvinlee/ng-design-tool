import { ElementMouseHandles } from './element-mouse-handles.enum';

export interface HoveredElement {
  key: string;
  mouseHandle?: ElementMouseHandles.TOP_LEFT |
               ElementMouseHandles.TOP_RIGHT |
               ElementMouseHandles.BOTTOM_LEFT |
               ElementMouseHandles.BOTTOM_RIGHT |
               ElementMouseHandles.ROTATE;
}
