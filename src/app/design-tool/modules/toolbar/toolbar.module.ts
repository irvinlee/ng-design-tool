import { ToolbarComponent } from './toolbar/toolbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsertItemsPanelComponent } from './insert-items-panel/insert-items-panel.component';
import { FormattingOptionsPanelComponent } from './formatting-options-panel/formatting-options-panel.component';
import { EditOptionsPanelComponent } from './edit-options-panel/edit-options-panel.component';
import { ViewOptionsPanelComponent } from './view-options-panel/view-options-panel.component';
import { MainOptionsPanelComponent } from './main-options-panel/main-options-panel.component';


@NgModule({
  declarations: [
    ToolbarComponent,
    InsertItemsPanelComponent,
    FormattingOptionsPanelComponent,
    EditOptionsPanelComponent,
    ViewOptionsPanelComponent,
    MainOptionsPanelComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule { }
