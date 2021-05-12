import { DesignToolService } from './../../../design-tool.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-options-panel',
  templateUrl: './edit-options-panel.component.html',
  styleUrls: ['./edit-options-panel.component.scss']
})
export class EditOptionsPanelComponent implements OnInit, OnDestroy {
  private subscriptions: Array<Subscription> = [];
  isUndoEnabled = false;
  isRedoEnabled = false;

  constructor(private designToolService: DesignToolService) {
    this.subscriptions.push(
      this.designToolService.undoBufferLength.subscribe((bufferLength) => this.isUndoEnabled = !!bufferLength)
    );
    this.subscriptions.push(
      this.designToolService.redoBufferLength.subscribe((bufferLength) => this.isRedoEnabled = !!bufferLength)
    );
  }

  onUndo(): void {
    this.designToolService.undo();
  }

  onRedo(): void {
    this.designToolService.redo();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
