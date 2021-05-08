import { DesignCanvassComponent } from './design-canvass/design-canvass.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextItemComponent } from './text-item/text-item.component';
import { ImageItemComponent } from './image-item/image-item.component';
import { ShapeItemComponent } from './shape-item/shape-item.component';
import { StockImageItemComponent } from './stock-image-item/stock-image-item.component';



@NgModule({
  declarations: [
    DesignCanvassComponent,
    TextItemComponent,
    ImageItemComponent,
    ShapeItemComponent,
    StockImageItemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DesignCanvassComponent
  ]
})
export class DesignCanvassModule { }
