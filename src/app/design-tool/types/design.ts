import { StockImage } from './stock-image';
import { Image } from './image';
import { Text } from './text';

export interface Design {
  textItems: Array<Text>;
  imageItems: Array<Image>;
  stockImageItems: Array<StockImage>;
}
