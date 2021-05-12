import { DesignToolService } from './../../../design-tool.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-options-panel',
  templateUrl: './edit-options-panel.component.html',
  styleUrls: ['./edit-options-panel.component.scss']
})
export class EditOptionsPanelComponent implements OnInit {
  isUndoEnabled = false;
  isRedoEnabled = false;

  constructor(private designToolService: DesignToolService) {
    this.designToolService.undoBufferLength.subscribe((bufferLength) => this.isUndoEnabled = !!bufferLength);
    this.designToolService.redoBufferLength.subscribe((bufferLength) => this.isRedoEnabled = !!bufferLength);
  }

  onUndo(): void {
    this.designToolService.undo();
  }

  onRedo(): void {
    this.designToolService.redo();
  }

  ngOnInit(): void {
  }

}
