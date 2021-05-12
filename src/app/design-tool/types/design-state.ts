import { StockImage } from './stock-image';
import { Image } from './image';
import { Text } from './text';
import { Shape } from './shape';

export interface DesignState {
  elements: Map<string, StockImage | Image | Text | Shape>;
}
