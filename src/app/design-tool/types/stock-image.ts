import { Dimensions } from './dimensions';
import { Coordinates } from './coordinates';

export interface StockImage {
  src: string;
  price: number;
  coordinates: Coordinates;
  dimensions: Dimensions;
}

