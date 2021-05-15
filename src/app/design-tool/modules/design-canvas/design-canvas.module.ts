import { DesignToolService } from './../../design-tool.service';
import { DesignCanvasComponent } from './design-canvas/design-canvas.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DesignCanvasComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DesignCanvasComponent
  ],
  providers: [
    DesignToolService
  ]
})
export class DesignCanvasModule { }
