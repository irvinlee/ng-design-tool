import { DesignToolService } from './../../../design-tool.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-options-panel',
  templateUrl: './view-options-panel.component.html',
  styleUrls: ['./view-options-panel.component.scss']
})
export class ViewOptionsPanelComponent implements OnInit {
  zoomLevel = 1;

  constructor(private designToolService: DesignToolService) {
    this.designToolService.zoomLevel.subscribe(newZoomLevel => this.zoomLevel = newZoomLevel);
  }

  ngOnInit(): void {
  }

  onChangeZoomLevel(e: Event): void {
    this.designToolService.setZoomLevel(parseFloat((e.target as HTMLSelectElement).value));
  }
}
