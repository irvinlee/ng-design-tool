import { Dimensions } from './dimensions';
import { Coordinates } from './coordinates';

export interface Image {
  src?: string;
  coordinates: Coordinates;
  dimensions: Dimensions;
}
