import { TextAlign } from './text-align.enum';

export interface TextFormat {
  font: string;
  size: number;
  color: string;
  opacity: number;
  bgColor: string;
  isBold: boolean;
  isItalic: boolean;
  alignment: TextAlign.LEFT | TextAlign.CENTER | TextAlign.RIGHT;
}
