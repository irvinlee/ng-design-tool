import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignToolComponent } from './design-tool.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DesignCanvassComponent } from '../design-canvass/design-canvass.component';


@NgModule({
  declarations: [
    DesignToolComponent,
    ToolbarComponent,
    DesignCanvassComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DesignToolComponent
  ]
})
export class DesignToolModule { }
