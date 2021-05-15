import { DesignCanvasModule } from './modules/design-canvas/design-canvas.module';
import { DesignToolService } from './design-tool.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignToolComponent } from './design-tool.component';
import { ToolbarModule } from './modules/toolbar/toolbar.module';


@NgModule({
  declarations: [
    DesignToolComponent,
  ],
  imports: [
    CommonModule,
    ToolbarModule,
    DesignCanvasModule
  ],
  exports: [
    DesignToolComponent
  ],
  providers: [
    DesignToolService
  ]
})
export class DesignToolModule { }
