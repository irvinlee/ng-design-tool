import { DesignToolService } from './design-tool.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignToolComponent } from './design-tool.component';
import { ToolbarModule } from './modules/toolbar/toolbar.module';
import { DesignCanvassModule } from './modules/design-canvass/design-canvass.module';


@NgModule({
  declarations: [
    DesignToolComponent,
  ],
  imports: [
    CommonModule,
    ToolbarModule,
    DesignCanvassModule
  ],
  exports: [
    DesignToolComponent
  ],
  providers: [
    DesignToolService
  ]
})
export class DesignToolModule { }
