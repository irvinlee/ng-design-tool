import { Subscription } from 'rxjs';
import { DesignToolService } from './../../../design-tool.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-formatting-options-panel',
  templateUrl: './formatting-options-panel.component.html',
  styleUrls: ['./formatting-options-panel.component.scss']
})
export class FormattingOptionsPanelComponent implements OnInit, OnDestroy{
  private subscriptions: Array<Subscription> = [];
  canCrop = false;

  constructor(private designToolService: DesignToolService) {
    this.subscriptions.push(
      this.designToolService.canCrop.subscribe(canCrop => this.canCrop = canCrop)
    );
  }

  toggleCropMode(): void {
    this.designToolService.toggleCroppingMode();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
