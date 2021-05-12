import { Coordinates } from './../types/coordinates';
import { Dimensions } from './../types/dimensions';
import { TextFormat } from './../types/text-format';
import { Text } from './../types/text';
import { TextAlign } from '../types/text-align.enum';

export class TextModel implements Text{
  value = 'New Text Element';
  coordinates = {top: 10, left: 10} as Coordinates;
  dimensions = {height: 10, width: 50} as Dimensions;
  format = {
    font: 'Arial',
    size: 12,
    color: '#000',
    opacity: 100,
    bgColor: '#FFF',
    isBold: false,
    isItalic: false,
    alignment: TextAlign.LEFT
  } as TextFormat;

  constructor() {

  }
}
