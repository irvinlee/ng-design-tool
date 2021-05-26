import { DesignToolService } from './design-tool.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignToolComponent } from './design-tool/design-tool.component';
import { ToolbarModule } from './modules/toolbar/toolbar.module';
import { DesignCanvasComponent } from './design-canvas/design-canvas.component';


@NgModule({
  declarations: [
    DesignToolComponent,
    DesignCanvasComponent,
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
