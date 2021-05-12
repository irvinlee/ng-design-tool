import { DesignToolService } from './../../../design-tool.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ypdt-design-canvass',
  templateUrl: './design-canvass.component.html',
  styleUrls: ['./design-canvass.component.scss']
})
export class DesignCanvassComponent implements OnInit {

  constructor(private designToolService: DesignToolService) {
    this.designToolService.currentState.subscribe((canvassState) => {
      console.log(canvassState);
    });
  }

  ngOnInit(): void {
  }

}
