import { Shapes } from './shapes.enum';

export interface Shape {
  type: Shapes.RECTANGLE | Shapes.CIRCLE | Shapes.HORIZONTAL_LINE | Shapes.VERTICAL_LINE;
  fill: string;
  border: string;
  weight: number;
  stroke: string;
  opacity: number;
}
