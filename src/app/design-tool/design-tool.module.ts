import { DesignToolService } from './design-tool.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignToolComponent } from './design-tool/design-tool.component';
import { ToolbarModule } from './modules/toolbar/toolbar.module';
import { DesignCanvasComponent } from './design-canvas/design-canvas.component';
import { CropToolComponent } from './crop-tool/crop-tool.component';


@NgModule({
  declarations: [
    DesignToolComponent,
    DesignCanvasComponent,
    CropToolComponent,
  ],
  imports: [
    CommonModule,
    ToolbarModule,
  ],
  exports: [
    DesignToolComponent
  ],
  providers: [
    DesignToolService
  ]
})
export class DesignToolModule { }
