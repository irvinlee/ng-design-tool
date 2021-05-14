import { TextFormat } from './text-format';
import { Dimensions } from './dimensions';
import { Coordinates } from './coordinates';

export interface Text {
  value: string;
  coordinates: Coordinates;
  format: TextFormat;
}
