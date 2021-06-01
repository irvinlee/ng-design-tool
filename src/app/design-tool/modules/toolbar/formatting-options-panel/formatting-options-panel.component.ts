import { DesignToolService } from './../../../design-tool.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formatting-options-panel',
  templateUrl: './formatting-options-panel.component.html',
  styleUrls: ['./formatting-options-panel.component.scss']
})
export class FormattingOptionsPanelComponent implements OnInit {

  constructor(private designToolService: DesignToolService) { }

  ngOnInit(): void {
  }

}
