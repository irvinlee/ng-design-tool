import { TextModel } from './../../../models/text-model';
import { Text } from './../../../types/text';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-text-item',
  templateUrl: './text-item.component.html',
  styleUrls: ['./text-item.component.scss']
})
export class TextItemComponent implements OnInit {
  @Input() id = '';
  @Input() data: Text = new TextModel();
  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
