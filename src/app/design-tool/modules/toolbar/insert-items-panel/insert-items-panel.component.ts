import { DesignToolService } from './../../../design-tool.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ypdt-insert-items-panel',
  templateUrl: './insert-items-panel.component.html',
  styleUrls: ['./insert-items-panel.component.scss']
})
export class InsertItemsPanelComponent implements OnInit {

  constructor(private designToolService: DesignToolService) { }

  ngOnInit(): void {
  }

  onInsertText(): void {
    this.designToolService.insertText();
  }
}
