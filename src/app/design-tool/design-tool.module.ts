import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignToolComponent } from './design-tool.component';
import { ToolbarModule } from './toolbar/toolbar.module';
import { DesignCanvassModule } from './design-canvass/design-canvass.module';


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
  ]
})
export class DesignToolModule { }
