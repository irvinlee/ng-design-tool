import { Subscription } from 'rxjs';
import { DesignToolService } from './../../../design-tool.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-view-options-panel',
  templateUrl: './view-options-panel.component.html',
  styleUrls: ['./view-options-panel.component.scss']
})
export class ViewOptionsPanelComponent implements OnInit, OnDestroy {
  zoomLevel = 1;
  private subscriptions?: Array<Subscription>;

  constructor(private designToolService: DesignToolService) {
    this.subscriptions?.push(this.designToolService.zoomLevel.subscribe(newZoomLevel => this.zoomLevel = newZoomLevel));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(subscription => subscription.unsubscribe());
  }

  onChangeZoomLevel(e: Event): void {
    this.designToolService.setZoomLevel(parseFloat((e.target as HTMLSelectElement).value));
  }
}
